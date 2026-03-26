import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { observer } from "mobx-react-lite";
import { getExercisesByMuscle } from "../api/exerciseDbApi";
import { ExplorerView } from "../views/ExplorerView";
import { ExerciseCardView } from "../views/ExerciseCardView";
import { AsyncStateView } from "../views/common/AsyncStateView";
import { resolvePromise } from "../utils/resolvePromise";

const FILTERS = ["all", "chest", "upper legs", "back"];
const DEFAULT_FILTER = "chest";

export default observer(function ExplorerPresenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(DEFAULT_FILTER);
  const [draftExercises, setDraftExercises] = useState([]);
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

  function onAddExerciseACB(exercise) {
    if (!exercise || !exercise.id) {
      return;
    }

    setDraftExercises(function updateDraftExercises(currentExercises) {
      const existingExercise = currentExercises.find(function matchExerciseCB(item) {
        return item.id === exercise.id;
      });

      if (existingExercise) {
        return currentExercises.filter(function keepExerciseCB(item) {
          return item.id !== exercise.id;
        });
      }

      return currentExercises.concat([exercise]);
    });
  }

  function onViewPlanACB() {
    // TODO: connect to details/save flow later in the project.
  }

  function fetchExercisesByFilter(muscle) {
    const promiseState = {
      promise: null,
      data: null,
      error: null,
    };
    const request = getExercisesByMuscle(resolveApiMuscle(muscle)).then(
      function normalizeResultsCB(results) {
        return normalizeExerciseList(results);
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
    const exercises = searchPromiseState.data || [];
    const normalizedQuery = (searchQuery || "").trim().toLowerCase();

    if (!normalizedQuery) {
      return exercises;
    }

    return exercises.filter(function matchQueryCB(exercise) {
      return (exercise.name || "").toLowerCase().indexOf(normalizedQuery) >= 0;
    });
  }

  function getAddedExerciseIds() {
    return draftExercises.map(getExerciseIdCB);
  }

  function renderExerciseItem(info) {
    const exercise = info.item;
    const addedExerciseIds = getAddedExerciseIds();
    const isAdded = addedExerciseIds.indexOf(exercise.id) >= 0;

    return (
      <ExerciseCardView
        exercise={exercise}
        isAdded={isAdded}
        onAdd={onAddExerciseACB}
      />
    );
  }

  function keyExtractor(item) {
    return String(item.id);
  }

  function renderResultsContent() {
    const exercises = getVisibleExercises();
    const loading =
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
      customPlanCount={draftExercises.length}
      onSearch={onSearchACB}
      onFilterChange={onFilterChangeACB}
      onViewPlan={onViewPlanACB}
      resultsContent={renderResultsContent()}
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

  return {
    id: String(exercise.id),
    name: exercise.name,
    targetMuscle: exercise.target || exercise.targetMuscle || "Unknown",
    gifUrl: exercise.gifUrl || "",
    instructions: instructions,
    sets: 3,
    reps: 10,
  };
}

function hasExerciseIdCB(exercise) {
  return Boolean(exercise && exercise.id);
}

function getExerciseIdCB(exercise) {
  return exercise.id;
}
