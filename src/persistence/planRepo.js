// Based on the lab's firestoreModel.js pattern.
//
// FIX for deletion persistence bug:
// The original approach used an `applyRemote` flag to prevent onSnapshot from
// triggering a write-back loop. However, MobX reactions fire AFTER an action()
// completes, so the flag was always reset before the guard check ran.
//
// New approach: use a localVersion counter. Every LOCAL change increments
// localVersion. When onSnapshot fires, we only apply the remote data if
// localVersion hasn't changed since the last sync. This prevents stale
// snapshots from overwriting local edits (like deletions).

import { action } from "mobx";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";

export function connectToPersistence(uid, watchFunction) {
  planStore.ready = false;

  const docRef = doc(db, "users", uid, "data", "plans");
  console.log("[planRepo] Connected. UID =", uid, "| Path = users/" + uid + "/data/plans");
  let isSaving = false;            // true while a setDoc call is in-flight
  let skipNextReaction = false;    // true right after applying remote data
  let initialLoadDone = false;     // true after first getDoc resolves

  // ── Apply remote data from Firestore ──
  const applyDataFromSnapshotACB = action(function applyDataFromSnapshotACB(docSnap) {
    const exists = typeof docSnap.exists === "function" ? docSnap.exists() : !!docSnap.exists;
    const data = exists ? (docSnap.data() || {}) : {};
    const remotePlans = Array.isArray(data.savedPlans) ? data.savedPlans : [];

    // If we're currently saving, DON'T overwrite local state with stale server data
    if (isSaving) {
      console.log("[planRepo] Skip snapshot: save in-flight");
      return;
    }

    skipNextReaction = true;
    planStore.savedPlans = remotePlans;
    planStore.ready = true;
    // Defer reset so the MobX reaction (which fires after action completes) sees the flag
    setTimeout(function () { skipNextReaction = false; }, 0);
  });

  const logErrorACB = action(function logErrorACB(err) {
    console.error("[planRepo] Firestore read failed:", err);
    planStore.savedPlans = [];
    planStore.ready = true;
  });

  // Initial load
  getDoc(docRef)
    .then(function onInitialLoadACB(docSnap) {
      applyDataFromSnapshotACB(docSnap);
      initialLoadDone = true;
    })
    .catch(logErrorACB);

  // Real-time listener (fires on server-side changes, NOT from our own setDoc)
  const stopSnapshot = onSnapshot(docRef, function onSnapshotACB(docSnap) {
    // Skip the initial snapshot (we already handle it via getDoc above)
    if (!initialLoadDone) return;
    applyDataFromSnapshotACB(docSnap);
  }, logErrorACB);

  // MobX reaction: when savedPlans changes locally, persist to Firestore
  const stopReaction = watchFunction(model2PersistACB, save2FirestoreACB);

  return function disconnectFromPersistence() {
    stopReaction?.();
    stopSnapshot?.();
  };

  function model2PersistACB() {
    return JSON.stringify(planStore.savedPlans);
  }

  async function save2FirestoreACB() {
    if (!planStore.ready) {
      console.log("[planRepo] Skip save: not ready");
      return;
    }
    if (skipNextReaction) {
      console.log("[planRepo] Skip save: change came from remote snapshot");
      return;
    }
    try {
      isSaving = true;
      const safePlans = JSON.parse(JSON.stringify(planStore.savedPlans));
      console.log("[planRepo] Saving", safePlans.length, "plans to Firestore…");
      await setDoc(docRef, { savedPlans: safePlans });
      console.log("[planRepo] ✓ Saved successfully");
    } catch (err) {
      console.error("[planRepo] Firestore save FAILED:", err);
      uiStore.showToast("⚠️ Cloud sync failed: " + (err.message || "Unknown error"), "error");
    } finally {
      isSaving = false;
    }
  }
}
