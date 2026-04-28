import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { Alert, Platform } from "react-native";
import { planStore } from "../model/planStore";
import { SavedPlansView } from "../views/SavedPlansView";

export default observer(function SavedPlansPresenter() {
  const router = useRouter();

  function onStartPlanACB(plan) {
    planStore.setCurrentPlan(plan);
    router.push("/(tabs)/plan");
  }

  function onDeletePlanACB(planId) {
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
    const today = new Date();
    const completedDates = plan.completedDates || [];

    return completedDates.filter(function countThisWeekCB(dateStr) {
      const date = new Date(dateStr);
      const diffMs = today - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays < 7;
    }).length;
  }

  return (
    <SavedPlansView
      savedPlans={planStore.savedPlans}
      getThisWeekCount={getThisWeekCount}
      onStartPlan={onStartPlanACB}
      onDeletePlan={onDeletePlanACB}
    />
  );
});
