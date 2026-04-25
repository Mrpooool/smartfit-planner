import { observer } from "mobx-react-lite";
import { useRouter } from "expo-router";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { userStore } from "../model/userStore";
import { logoutUser } from "../persistence/authRepo";
import { ProfileView } from "../views/ProfileView";

export default observer(function ProfilePresenter() {
  const router = useRouter();
  const allCompletedDates = getUniqueCompletedDates(planStore.completionHistory);

  function getUniqueCompletedDates(history) {
    return [...new Set(history || [])].sort();
  }

  function getThisWeekCount() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    const weekAgoStr = weekAgo.toISOString().split("T")[0];
    return allCompletedDates.filter(function isThisWeekCB(d) {
      return d >= weekAgoStr;
    }).length;
  }

  function onLogoutACB() {
    logoutUser();
  }

  function onNavigateToPlansACB() {
    router.replace("/(tabs)/plan");
  }

  function onImageModeChangeACB(useAnimatedImages) {
    if (Boolean(userStore.showAnimatedListImages) === Boolean(useAnimatedImages)) {
      return;
    }

    userStore.setShowAnimatedListImages(useAnimatedImages);
    uiStore.showToast(
      useAnimatedImages ? "Motion preview enabled." : "Data saver preview enabled.",
      "success"
    );
  }

  return (
    <ProfileView
      savedPlans={planStore.savedPlans}
      email={userStore.email}
      username={userStore.username}
      completedDates={allCompletedDates}
      totalWorkouts={allCompletedDates.length}
      thisWeekCount={getThisWeekCount()}
      savedPlansCount={planStore.savedPlans.length}
      showAnimatedListImages={userStore.showAnimatedListImages}
      onImageModeChange={onImageModeChangeACB}
      onNavigateToPlans={onNavigateToPlansACB}
      onLogout={onLogoutACB}
    />
  );
});
