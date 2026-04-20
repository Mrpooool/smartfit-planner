import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { PlanView } from "../views/PlanView";
import { PlanDirectoryView } from "../views/PlanDirectoryView";

export default observer(function PlanPresenter() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("directory"); // "directory" | "detail"

  // ── Directory handlers ──

  function onStartPlanACB(plan) {
    planStore.setCurrentPlan(plan);
    setViewMode("detail");
  }

  function onCreateNewPlanACB(name) {
    planStore.createNewPlan(name);
    setViewMode("detail");
  }

  function onDeletePlanFromDirectoryACB(planId) {
    function performDelete() {
      planStore.removeSavedPlan(planId);
      if (planStore.currentPlan && planStore.currentPlan.id === planId) {
        planStore.setCurrentPlan(null);
      }
    }

    if (Platform.OS === "web") {
      setTimeout(function delayConfirmACB() {
        if (window.confirm("Are you sure you want to delete this plan?")) {
          performDelete();
        }
      }, 0);
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

  function getThisWeekCount(plan) {
    var today = new Date();
    var completedDates = plan.completedDates || [];
    return completedDates.filter(function countThisWeekCB(dateStr) {
      var date = new Date(dateStr);
      var diffMs = today - date;
      var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays < 7;
    }).length;
  }

  // ── Detail handlers ──

  function onBackToDirectoryACB() {
    setViewMode("directory");
  }

  function onAddExerciseACB() {
    router.replace("/(tabs)/explore");
  }

  function getLocalDateString() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function onMarkCompletedACB() {
    var plan = planStore.currentPlan;
    if (!plan) return;

    var isSaved = planStore.savedPlans.some(function matchIdCB(p) { return p.id === plan.id; });
    if (!isSaved) {
      uiStore.showToast("⚠️ Please save this training plan first.", "warning");
      return;
    }

    var today = getLocalDateString();
    var alreadyDone = (plan.completedDates || []).includes(today);
    if (alreadyDone) {
      uiStore.showToast("✅ Already completed today.", "info");
      return;
    }
    planStore.markCompleted(plan.id, today);
    uiStore.showToast("💪 Workout logged for today!", "success");

    // Return to plan directory so users don't have to scroll up
    setViewMode("directory");
  }

  function onEditExerciseACB(exerciseIndex, field, value) {
    var num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    planStore.updateExerciseField(exerciseIndex, field, num);
  }

  function onRenamePlanACB(newName) {
    planStore.renamePlan(newName);
  }

  function onPressExerciseACB(index) {
    router.push("/action/" + index);
  }

  function onDeletePlanACB() {
    var plan = planStore.currentPlan;
    if (!plan) return;

    function performDelete() {
      planStore.removeSavedPlan(plan.id);
      planStore.setCurrentPlan(null);
      setViewMode("directory");
    }

    if (Platform.OS === "web") {
      setTimeout(function delayConfirmACB() {
        if (window.confirm("Are you sure you want to delete this plan?")) {
          performDelete();
        }
      }, 0);
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

  // ── Render ──

  if (viewMode === "detail") {
    return (
      <PlanView
        plan={planStore.currentPlan}
        onMarkCompleted={onMarkCompletedACB}
        onEditExercise={onEditExerciseACB}
        onPressExercise={onPressExerciseACB}
        onRenamePlan={onRenamePlanACB}
        onDeletePlan={onDeletePlanACB}
        onAddExercise={onAddExerciseACB}
        onBack={onBackToDirectoryACB}
      />
    );
  }

  function isCompletedTodayACB(plan) {
    var today = getLocalDateString();
    return (plan.completedDates || []).includes(today);
  }

  return (
    <PlanDirectoryView
      savedPlans={planStore.savedPlans}
      getThisWeekCount={getThisWeekCount}
      isCompletedToday={isCompletedTodayACB}
      onStartPlan={onStartPlanACB}
      onDeletePlan={onDeletePlanFromDirectoryACB}
      onCreateNewPlan={onCreateNewPlanACB}
    />
  );
});
