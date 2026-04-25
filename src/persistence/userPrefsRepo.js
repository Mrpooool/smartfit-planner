import { action } from "mobx";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { userStore } from "../model/userStore";
import { uiStore } from "../model/uiStore";

export function connectUserPrefsPersistence(uid, watchFunction) {
  const docRef = doc(db, "users", uid, "data", "preferences");
  let isSaving = false;
  let skipNextReaction = false;
  let initialLoadDone = false;
  let ready = false;

  async function applyPrefsFromSnapshotACB(docSnap) {
    const exists = typeof docSnap.exists === "function" ? docSnap.exists() : !!docSnap.exists;
    const data = exists ? (docSnap.data() || {}) : {};

    if (isSaving) {
      return;
    }

    action(function applyRemotePrefsACB() {
      skipNextReaction = true;
      userStore.setShowAnimatedListImages(Boolean(data.showAnimatedListImages));
      setTimeout(function resetSkipFlagACB() {
        skipNextReaction = false;
      }, 0);
    })();
  }

  getDoc(docRef)
    .then(function onInitialLoadACB(docSnap) {
      return applyPrefsFromSnapshotACB(docSnap).then(function markInitialLoadDoneCB() {
        initialLoadDone = true;
        ready = true;
      });
    })
    .catch(function onReadErrorACB(err) {
      console.error("[userPrefsRepo] Firestore read failed:", err);
      ready = true;
    });

  const stopSnapshot = onSnapshot(
    docRef,
    function onSnapshotACB(docSnap) {
      if (!initialLoadDone) return;
      applyPrefsFromSnapshotACB(docSnap).catch(function onApplyErrorACB(err) {
        console.error("[userPrefsRepo] Snapshot apply failed:", err);
      });
    },
    function onSnapshotErrorACB(err) {
      console.error("[userPrefsRepo] Firestore snapshot failed:", err);
    }
  );

  const stopReaction = watchFunction(model2PersistACB, save2FirestoreACB);

  return function disconnectFromPersistence() {
    stopReaction?.();
    stopSnapshot?.();
  };

  function model2PersistACB() {
    return JSON.stringify({
      showAnimatedListImages: Boolean(userStore.showAnimatedListImages),
    });
  }

  async function save2FirestoreACB() {
    if (!userStore.uid) {
      return;
    }
    if (!ready) {
      return;
    }
    if (skipNextReaction) {
      return;
    }

    try {
      isSaving = true;
      await setDoc(docRef, {
        showAnimatedListImages: Boolean(userStore.showAnimatedListImages),
      });
    } catch (err) {
      console.error("[userPrefsRepo] Firestore save failed:", err);
      uiStore.showToast("Failed to save display preference: " + (err.message || "Unknown error"), "error");
    } finally {
      isSaving = false;
    }
  }
}
