import { observer } from "mobx-react-lite";
import { useRouter } from "expo-router";
import { Alert, Platform } from "react-native";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { userStore } from "../model/userStore";
import { logoutUser } from "../persistence/authRepo";
import { ProfileView } from "../views/ProfileView";

export default observer(function ProfilePresenter() {
  const router = useRouter();
  const allCompletedDates = getUniqueCompletedDates([
    ...(planStore.completionHistory || []),
    ...(planStore.workoutHistory || []).map(function mapWorkoutDateCB(workout) {
      return workout.date;
    }),
  ]);

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
    function performLogout() {
      logoutUser();
    }

    if (Platform.OS === "web") {
      setTimeout(function delayConfirmACB() {
        if (window.confirm("Are you sure you want to log out?")) {
          performLogout();
        }
      }, 0);
    } else {
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Logout", style: "destructive", onPress: performLogout },
        ]
      );
    }
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

  function getWorkoutsByDate() {
    return (planStore.workoutHistory || []).reduce(function groupByDateCB(result, workout) {
      if (!workout || !workout.date) return result;
      return {
        ...result,
        [workout.date]: [...(result[workout.date] || []), workout],
      };
    }, {});
  }

  return (
    <ProfileView
      savedPlans={planStore.savedPlans}
      email={userStore.email}
      username={userStore.username}
      completedDates={allCompletedDates}
      workoutsByDate={getWorkoutsByDate()}
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
