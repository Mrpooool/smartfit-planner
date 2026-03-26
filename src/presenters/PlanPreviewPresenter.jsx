import { observer } from "mobx-react-lite";
import { useRouter } from "expo-router";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { PlanView } from "../views/PlanView";

export default observer(function PlanPreviewPresenter() {
  const router = useRouter();
  const plan = planStore.generatedPlan;

  function onAddToPlanACB() {
    if (!plan) return;
    
    // Assign draft plan to active plan
    planStore.setCurrentPlan({ ...plan });
    
    // Explicitly save it to the library
    planStore.addSavedPlan({ ...plan });
    
    // Clear draft state to release memory
    planStore.setGeneratedPlan(null);
    
    uiStore.showToast("🎉 Plan added to your library!", "success");
    
    // Route back to the main plan tab
    router.replace("/(tabs)/plan");
  }

  function onPressExerciseACB(index) {
    router.push(`/action/${index}?source=generated`);
  }

  return (
    <PlanView
      plan={plan}
      previewMode={true}
      onSavePlan={onAddToPlanACB}
      onPressExercise={onPressExerciseACB}
      onMarkCompleted={() => {}}
      onEditExercise={() => {}}
      onRenamePlan={() => {}}
      onDeletePlan={() => {}}
    />
  );
});
