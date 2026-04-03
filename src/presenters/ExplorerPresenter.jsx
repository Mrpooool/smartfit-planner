import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import { getExercisesByMuscle } from "../api/exerciseDbApi";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { resolvePromise } from "../utils/resolvePromise";
import { ExerciseCardView } from "../views/ExerciseCardView";
import { ExplorerView } from "../views/ExplorerView";
import { AsyncStateView } from "../views/common/AsyncStateView";

const FILTERS = ["all", "chest", "upper legs", "back"];
const DEFAULT_FILTER = "chest";
const EXERCISE_CACHE = {}; // In-memory cache to save API quota

export default observer(function ExplorerPresenter() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(DEFAULT_FILTER);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [searchPromiseState, setSearchPromiseState] = useState({
    promise: null,
    data: null,
    error: null,
  });

  useEffect(function initialLoadEffect() {
    fetchExercisesByFilter(DEFAULT_FILTER);
  }, []);

  function onSearchACB(query) {
    setSearchQuery(query);
  }

  function onFilterChangeACB(muscle) {
    setActiveFilter(muscle);
    fetchExercisesByFilter(muscle);
  }

  // ── Add button → open modal ──
  function onAddExerciseACB(exercise) {
    if (!exercise || !exercise.id) return;
    setSelectedExercise(exercise);
    setModalVisible(true);
  }

  function onExercisePressACB(exercise) {
    router.push({
      pathname: "/details",
      params: { id: String(exercise.id) },
    });
  }

  // ── Modal: select existing plan ──
  function onSelectPlanACB(planId) {
    if (!selectedExercise) return;
    let result = planStore.addExerciseToPlan(planId, selectedExercise);
    if (result === "duplicate") {
      uiStore.showToast("⚠️ This exercise is already in that plan.", "warning");
    } else if (result === "added") {
      uiStore.showToast("✅ Exercise added to plan!", "success");
    }
    setModalVisible(false);
    setSelectedExercise(null);
  }

  // ── Modal: create new plan + add exercise ──
  function onCreateNewPlanACB(planName) {
    let newPlan = planStore.createNewPlan(planName);
    if (selectedExercise && newPlan) {
      planStore.addExerciseToPlan(newPlan.id, selectedExercise);
    }
    uiStore.showToast("✅ New plan created & exercise added!", "success");
    setModalVisible(false);
    setSelectedExercise(null);
  }

  function onCloseModalACB() {
    setModalVisible(false);
    setSelectedExercise(null);
  }

  function fetchExercisesByFilter(muscle) {
    const resolvedMuscle = resolveApiMuscle(muscle);

    // 1. Check if we already have it in cache to save API quota
    if (EXERCISE_CACHE[resolvedMuscle]) {
      setSearchPromiseState({
        promise: Promise.resolve(EXERCISE_CACHE[resolvedMuscle]),
        data: EXERCISE_CACHE[resolvedMuscle],
        error: null,
      });
      return;
    }

    let promiseState = {
      promise: null,
      data: null,
      error: null,
    };
    let request = getExercisesByMuscle(resolvedMuscle).then(
      function normalizeResultsCB(results) {
        let normalized = normalizeExerciseList(results);
        // 2. Save result to cache
        EXERCISE_CACHE[resolvedMuscle] = normalized;
        return normalized;
      }
    );

    setSearchPromiseState(promiseState);
    resolvePromise(request, promiseState);

    request
      .then(function applyDataCB(data) {
        setSearchPromiseState({
          promise: request,
          data: data,
          error: null,
        });
      })
      .catch(function applyErrorCB(error) {
        setSearchPromiseState({
          promise: request,
          data: null,
          error: error,
        });
      });
  }

  function getVisibleExercises() {
    let exercises = searchPromiseState.data || [];
    let normalizedQuery = (searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return exercises;
    }

    return exercises.filter(function matchQueryCB(exercise) {
      return (exercise.name || "").toLowerCase().indexOf(normalizedQuery) >= 0;
    });
  }

  function renderExerciseItem(info) {
    let exercise = info.item;

    function handleExercisePress() {
      onExercisePressACB(exercise);
    }

    return (
      <ExerciseCardView
        exercise={exercise}
        onAdd={onAddExerciseACB}
        onPress={handleExercisePress}
      />
    );
  }

  function keyExtractor(item) {
    return String(item.id);
  }

  function renderResultsContent() {
    let exercises = getVisibleExercises();
    let loading =
      searchPromiseState.promise &&
      searchPromiseState.data === null &&
      searchPromiseState.error === null;

    if (loading || searchPromiseState.error || exercises.length === 0) {
      return (
        <AsyncStateView
          promise={searchPromiseState.promise}
          error={searchPromiseState.error}
          data={searchPromiseState.data}
          empty={exercises.length === 0}
          emptyMessage="No exercises to show yet."
        />
      );
    }

    return (
      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <ExplorerView
      searchQuery={searchQuery}
      filters={FILTERS}
      activeFilter={activeFilter}
      onSearch={onSearchACB}
      onFilterChange={onFilterChangeACB}
      resultsContent={renderResultsContent()}
      modalVisible={modalVisible}
      selectedExercise={selectedExercise}
      savedPlans={planStore.savedPlans}
      onSelectPlan={onSelectPlanACB}
      onCreateNewPlan={onCreateNewPlanACB}
      onCloseModal={onCloseModalACB}
    />
  );
});

function resolveApiMuscle(muscle) {
  if (!muscle || muscle === "all") {
    return DEFAULT_FILTER;
  }
  return muscle;
}

function normalizeExerciseList(exercises) {
  return exercises.map(normalizeExerciseCB).filter(hasExerciseIdCB);
}

function normalizeExerciseCB(exercise) {
  const instructions = Array.isArray(exercise.instructions)
    ? exercise.instructions.join(" ")
    : exercise.instructions || "";

  let imageUrl =
    exercise.gifUrl ||
    exercise.imageUrl ||
    exercise.image ||
    "";
  let exerciseId = String(exercise.id);

  return {
    id: exerciseId,
    exerciseDbId: exerciseId,
    name: exercise.name,
    targetMuscle: exercise.target || exercise.targetMuscle || "Unknown",
    bodyPart: exercise.bodyPart || "",
    equipment: exercise.equipment || "",
    gifUrl: imageUrl,
    instructions: instructions,
    sets: 3,
    reps: 10,
  };
}

function hasExerciseIdCB(exercise) {
  return Boolean(exercise && exercise.id);
}
