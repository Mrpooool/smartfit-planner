import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { planStore } from "../model/planStore";
import { SavedPlansView } from "../views/SavedPlansView";

export default observer(function SavedPlansPresenter() {
  const router = useRouter();

  function onStartPlanACB(plan) {
    planStore.setCurrentPlan(plan);
    router.push("/(tabs)/plan");
  }

  function onDeletePlanACB(planId) {
    planStore.removeSavedPlan(planId);
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