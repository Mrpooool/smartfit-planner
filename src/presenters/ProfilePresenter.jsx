import { router } from "expo-router";
import { observer } from "mobx-react-lite";
import { planStore } from "../model/planStore";
import { userStore } from "../model/userStore";
import { logoutUser } from "../persistence/authRepo";
import { ProfileView } from "../views/ProfileView";

export default observer(function ProfilePresenter() {

  const allCompletedDates = getAllCompletedDates(planStore.savedPlans);

  function getAllCompletedDates(plans) {
    const allDates = plans.flatMap(getCompletedDatesFromPlanCB);
    return [...new Set(allDates)].sort();
  }

  function getCompletedDatesFromPlanCB(plan) {
    return plan.completedDates || [];
  }

  function getThisWeekCount() {//计算最近7天内完成的锻炼次数
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const weekAgoStr = weekAgo.toISOString().split("T")[0];
    return allCompletedDates.filter(function isThisWeekCB(d) {
      return d >= weekAgoStr;
    }).length;
  }

  function onOpenSavedPlansACB() {
    router.push("/savedplans");
  }

  function onLogoutACB() {
    logoutUser();
    // userStore.clearUser() is called automatically via onAuthStateChanged in authRepo
  }

  return (
    <ProfileView
      email={userStore.email}
      completedDates={allCompletedDates}
      totalWorkouts={allCompletedDates.length}
      thisWeekCount={getThisWeekCount()}
      savedPlansCount={planStore.savedPlans.length}
      onOpenPlans={onOpenSavedPlansACB}
      onLogout={onLogoutACB}
    />
  );
});
