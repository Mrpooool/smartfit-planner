import { observer } from "mobx-react-lite";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { planStore } from "../model/planStore";
import { PlanView } from "../views/PlanView";

export default observer(function PlanPresenter() {
  const router = useRouter();
  const plan = planStore.currentPlan;

  // ── Save plan to savedPlans (Firestore write triggered automatically via reaction) ──
  function onSavePlanACB() {
    if (!plan) return;
    const exists = planStore.savedPlans.some(function matchIdCB(p) {
      return p.id === plan.id;
    });
    if (exists) {
      // Plan already saved → update it
      planStore.updateSavedPlan(plan.id, plan);
    } else {
      // New plan → add it
      planStore.addSavedPlan({ ...plan });
    }
    Alert.alert("Success", "Plan saved to your library!");
  }

  // ── Mark today as completed ──
  function onMarkCompletedACB() {
    if (!plan) return;
    const today = new Date().toISOString().split("T")[0]; // "2026-03-23"

    // Check if already completed today
    const alreadyDone = (plan.completedDates || []).includes(today);
    if (alreadyDone) {
      Alert.alert("Info", "You already marked this plan as completed today.");
      return;
    }
    planStore.markCompleted(plan.id, today);
    Alert.alert("Well done! 💪", "Workout logged for today!");
  }

  // ── Edit exercise sets/reps inline ──
  function onEditExerciseACB(exerciseIndex, field, value) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    planStore.updateExerciseField(exerciseIndex, field, num);
  }

  // ── Rename plan ──
  function onRenamePlanACB(newName) {
    planStore.renamePlan(newName);
  }

  // ── Open Action Details ──
  function onPressExerciseACB(index) {
    router.push(`/action/${index}`);
  }

  // ── Delete plan ──
  function onDeletePlanACB() {
    if (!plan) return;
    Alert.alert(
      "Delete Plan",
      "Are you sure you want to delete this plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: function confirmDeleteACB() {
            planStore.removeSavedPlan(plan.id);
            planStore.setCurrentPlan(null);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <PlanView
      plan={plan}
      onSavePlan={onSavePlanACB}
      onMarkCompleted={onMarkCompletedACB}
      onEditExercise={onEditExerciseACB}
      onPressExercise={onPressExerciseACB}
      onRenamePlan={onRenamePlanACB}
      onDeletePlan={onDeletePlanACB}
    />
  );
});
