import { observer } from "mobx-react-lite";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
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
      planStore.updateSavedPlan(plan.id, plan);
    } else {
      planStore.addSavedPlan({ ...plan });
    }
    uiStore.showToast("⭐ Plan saved to your library!", "success");
  }

  // ── Mark today as completed ──
  function onMarkCompletedACB() {
    if (!plan) return;
    
    // Require plan to be saved first
    const isSaved = planStore.savedPlans.some(function matchIdCB(p) { return p.id === plan.id; });
    if (!isSaved) {
      uiStore.showToast("⚠️ Please save this training plan first.", "warning");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // "2026-03-23"

    // Check if already completed today
    const alreadyDone = (plan.completedDates || []).includes(today);
    if (alreadyDone) {
      uiStore.showToast("✅ Already completed today.", "info");
      return;
    }
    planStore.markCompleted(plan.id, today);
    uiStore.showToast("💪 Workout logged for today!", "success");
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
    
    function performDelete() {
      planStore.removeSavedPlan(plan.id);
      planStore.setCurrentPlan(null);
      router.back();
    }

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this plan?")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Delete Plan",
        "Are you sure you want to delete this plan?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: performDelete },
        ]
      );
    }
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
