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

  function onOpenSavedPlansACB() {
    router.push("/savedplans");
  }

  function onLogoutACB() {
    logoutUser();
    // userStore.clearUser() is called automatically via onAuthStateChanged in authRepo
  }

  return (
    <ProfileView
      savedPlans={planStore.savedPlans}
      email={userStore.email}
      onOpenPlans={onOpenSavedPlansACB}
      onLogout={onLogoutACB}
      completedDates={allCompletedDates}
    />
  );
});
