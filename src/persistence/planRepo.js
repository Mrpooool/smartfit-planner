// Based on the lab's firestoreModel.js pattern.
// Key concepts carried over from the lab:
//   - applyRemote flag prevents write-back loops when applying Firestore data
//   - planStore.ready gates the root layout (nothing meaningful renders until loaded)
//   - onSnapshot provides live updates across devices (A+ criterion)

import { action } from "mobx";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { planStore } from "../model/planStore";

// Call after user logs in, passing MobX's reaction function.
// Returns a disconnect function to call on logout.
export function connectToPersistence(uid, watchFunction) {
  planStore.ready = false;

  const docRef = doc(db, "users", uid, "data", "plans");
  let applyRemote = false; // prevents write-back loop when applying remote data

  getDoc(docRef).then(applyDataFromSnapshotACB).catch(logErrorACB);

  const stopReaction = watchFunction(model2PersistACB, save2FirestoreACB);
  const stopSnapshot = onSnapshot(docRef, applyDataFromSnapshotACB, logErrorACB);

  return function disconnectFromPersistence() {
    stopReaction?.();
    stopSnapshot?.();
  };

  function model2PersistACB() {
    return [planStore.savedPlans];
  }

  async function save2FirestoreACB() {
    if (!planStore.ready || applyRemote) return;
    try {
      await setDoc(docRef, { savedPlans: planStore.savedPlans }, { merge: true });
    } catch (err) {
      console.error("Firestore save failed:", err);
    }
  }

  const applyDataFromSnapshotACB = action(function applyDataFromSnapshotACB(docSnap) {
    applyRemote = true;
    const exists = typeof docSnap.exists === "function" ? docSnap.exists() : !!docSnap.exists;
    const data = exists ? (docSnap.data() || {}) : {};
    planStore.savedPlans = Array.isArray(data.savedPlans) ? data.savedPlans : [];
    planStore.ready = true;
    applyRemote = false;
  });

  const logErrorACB = action(function logErrorACB(err) {
    console.error("Firestore read failed:", err);
    planStore.savedPlans = [];
    planStore.ready = true;
  });
}
