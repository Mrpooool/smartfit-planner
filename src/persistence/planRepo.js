import { action } from "mobx";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getExerciseById } from "../api/exerciseDbApi";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { normalizeExerciseFromDb } from "../utils/normalizeExercise";

export function connectToPersistence(uid, watchFunction) {
  planStore.ready = false;

  const docRef = doc(db, "users", uid, "data", "plans");
  console.log("[planRepo] Connected. UID =", uid, "| Path = users/" + uid + "/data/plans");
  let isSaving = false;
  let skipNextReaction = false;
  let initialLoadDone = false;

  async function applyDataFromSnapshotACB(docSnap) {
    const exists = typeof docSnap.exists === "function" ? docSnap.exists() : !!docSnap.exists;
    const data = exists ? (docSnap.data() || {}) : {};
    const remotePlans = await hydrateRemotePlans(Array.isArray(data.savedPlans) ? data.savedPlans : []);
    const remoteHistory = Array.isArray(data.completionHistory) ? data.completionHistory : [];
    const remoteWorkoutHistory = Array.isArray(data.workoutHistory) ? data.workoutHistory : [];

    if (isSaving) {
      console.log("[planRepo] Skip snapshot: save in-flight");
      return;
    }

    action(function applyHydratedRemoteACB() {
      skipNextReaction = true;
      planStore.savedPlans = remotePlans;
      planStore.completionHistory = remoteHistory;
      planStore.workoutHistory = remoteWorkoutHistory;
      planStore.ready = true;
      setTimeout(function resetSkipFlagACB() {
        skipNextReaction = false;
      }, 0);
    })();
  }

  const logErrorACB = action(function logErrorACB(err) {
    console.error("[planRepo] Firestore read failed:", err);
    planStore.savedPlans = [];
    planStore.completionHistory = [];
    planStore.workoutHistory = [];
    planStore.currentPlan = null;
    planStore.generatedPlan = null;
    planStore.ready = true;
  });

  getDoc(docRef)
    .then(function onInitialLoadACB(docSnap) {
      return applyDataFromSnapshotACB(docSnap).then(function markInitialLoadDoneCB() {
        initialLoadDone = true;
      });
    })
    .catch(logErrorACB);

  const stopSnapshot = onSnapshot(
    docRef,
    function onSnapshotACB(docSnap) {
      if (!initialLoadDone) return;
      applyDataFromSnapshotACB(docSnap).catch(logErrorACB);
    },
    logErrorACB
  );

  const stopReaction = watchFunction(model2PersistACB, save2FirestoreACB);

  return function disconnectFromPersistence() {
    stopReaction?.();
    stopSnapshot?.();
  };

  function model2PersistACB() {
    return JSON.stringify({
      savedPlans: serializePlansForPersistence(planStore.savedPlans),
      completionHistory: planStore.completionHistory,
      workoutHistory: planStore.workoutHistory,
    });
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
      const safePlans = serializePlansForPersistence(planStore.savedPlans);
      const safeHistory = JSON.parse(JSON.stringify(planStore.completionHistory));
      const safeWorkoutHistory = JSON.parse(JSON.stringify(planStore.workoutHistory));
      console.log("[planRepo] Saving", safePlans.length, "plans +", safeHistory.length, "history entries to Firestore...");
      await setDoc(docRef, {
        savedPlans: safePlans,
        completionHistory: safeHistory,
        workoutHistory: safeWorkoutHistory,
      });
      console.log("[planRepo] Saved successfully");
    } catch (err) {
      console.error("[planRepo] Firestore save FAILED:", err);
      uiStore.showToast("Cloud sync failed: " + (err.message || "Unknown error"), "error");
    } finally {
      isSaving = false;
    }
  }
}

function serializePlansForPersistence(plans) {
  return (Array.isArray(plans) ? plans : []).map(function serializePlanCB(plan) {
    return {
      id: String(plan?.id || ""),
      name: String(plan?.name || ""),
      createdAt: Number(plan?.createdAt || Date.now()),
      completedDates: Array.isArray(plan?.completedDates) ? [...plan.completedDates] : [],
      exercises: serializeExercisesForPersistence(plan?.exercises),
    };
  });
}

function serializeExercisesForPersistence(exercises) {
  return (Array.isArray(exercises) ? exercises : [])
    .map(function serializeExerciseCB(exercise) {
      const exerciseId = String(exercise?.exerciseDbId || exercise?.id || "").trim();
      if (!exerciseId) {
        return null;
      }

      return {
        exerciseId: exerciseId,
        sets: sanitizeExerciseNumber(exercise?.sets),
        reps: sanitizeExerciseNumber(exercise?.reps),
      };
    })
    .filter(Boolean);
}

async function hydrateRemotePlans(plans) {
  return Promise.all(
    (Array.isArray(plans) ? plans : []).map(async function hydratePlanCB(plan) {
      return {
        id: String(plan?.id || ""),
        name: String(plan?.name || ""),
        createdAt: Number(plan?.createdAt || Date.now()),
        completedDates: Array.isArray(plan?.completedDates) ? [...plan.completedDates] : [],
        exercises: await hydrateExercises(plan?.exercises),
      };
    })
  );
}

async function hydrateExercises(exercises) {
  const hydratedExercises = await Promise.all(
    (Array.isArray(exercises) ? exercises : []).map(async function hydrateExerciseCB(exercise) {
      const exerciseId = String(
        exercise?.exerciseId || exercise?.exerciseDbId || exercise?.id || ""
      ).trim();

      if (!exerciseId) {
        return null;
      }

      try {
        const exerciseFromDb = await getExerciseById(exerciseId);
        return normalizeExerciseFromDb(exerciseFromDb, {
          sets: sanitizeExerciseNumber(exercise?.sets),
          reps: sanitizeExerciseNumber(exercise?.reps),
        });
      } catch {
        return {
          id: exerciseId,
          exerciseDbId: exerciseId,
          name: String(exercise?.name || "Exercise unavailable"),
          searchName: String(exercise?.searchName || exercise?.name || ""),
          targetMuscle: String(exercise?.targetMuscle || exercise?.target || "Unknown"),
          bodyPart: String(exercise?.bodyPart || ""),
          equipment: String(exercise?.equipment || "Unknown"),
          gifUrl: String(exercise?.gifUrl || exercise?.imageUrl || exercise?.image || ""),
          instructions: Array.isArray(exercise?.instructions)
            ? exercise.instructions
            : (exercise?.instructions ? [exercise.instructions] : []),
          secondaryMuscles: Array.isArray(exercise?.secondaryMuscles) ? exercise.secondaryMuscles : [],
          description: String(exercise?.description || ""),
          difficulty: String(exercise?.difficulty || ""),
          category: String(exercise?.category || ""),
          sets: sanitizeExerciseNumber(exercise?.sets),
          reps: sanitizeExerciseNumber(exercise?.reps),
        };
      }
    })
  );

  return hydratedExercises.filter(Boolean);
}

function sanitizeExerciseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}
