import { observer } from "mobx-react-lite";
import { planStore } from "../model/planStore";
import { userStore } from "../model/userStore";
import { logoutUser } from "../persistence/authRepo";
import { ProfileView } from "../views/ProfileView";

export default observer(function ProfilePresenter() {
  function onStartPlanACB(plan) {
    planStore.setCurrentPlan(plan);
    // TODO: router.push("/details")
  }

  function onDeletePlanACB(planId) {
    planStore.removeSavedPlan(planId);
  }

  function onLogoutACB() {
    logoutUser();
    // userStore.clearUser() is called automatically via onAuthStateChanged in authRepo
  }

  return (
    <ProfileView
      savedPlans={planStore.savedPlans}
      email={userStore.email}
      onStartPlan={onStartPlanACB}
      onDeletePlan={onDeletePlanACB}
      onLogout={onLogoutACB}
    />
  );
});
