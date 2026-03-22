import { observer } from "mobx-react-lite";
import { planStore } from "../model/planStore";
import { ExplorerView } from "../views/ExplorerView";

export default observer(function ExplorerPresenter() {
  // TODO: local observable state for search query, active filter, custom plan draft
  // TODO: local observable promiseState for ExerciseDB search results

  function onSearchACB(query) {
    // TODO: resolvePromise(searchExercisesByName(query), promiseState)
  }

  function onFilterChangeACB(muscle) {
    // TODO: resolvePromise(getExercisesByMuscle(muscle), promiseState)
  }

  function onAddExerciseACB(exercise) {
    // TODO: add exercise to local custom plan draft (observable array)
  }

  return (
    <ExplorerView
      onSearch={onSearchACB}
      onFilterChange={onFilterChangeACB}
      onAddExercise={onAddExerciseACB}
    />
  );
});
