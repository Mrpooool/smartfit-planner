import { observer } from "mobx-react-lite";
import { planStore } from "../model/planStore";
import { PlanDetailView } from "../views/PlanDetailView";

export default observer(function DetailsPresenter() {
  const plan = planStore.currentPlan;

  function onSavePlanACB(updatedPlan) {
    // TODO: planStore.addSavedPlan(updatedPlan)
    // planRepo write is handled automatically via MobX reaction in planRepo.js
  }

  function onMarkCompletedACB(planId) {
    const today = new Date().toISOString().split("T")[0];
    planStore.markCompleted(planId, today);
  }

  function onEditExerciseACB(exerciseIndex, field, value) {
    // TODO: action to update sets/reps on planStore.currentPlan
  }

  return (
    <PlanDetailView
      plan={plan}
      onSavePlan={onSavePlanACB}
      onMarkCompleted={onMarkCompletedACB}
      onEditExercise={onEditExerciseACB}
    />
  );
});
