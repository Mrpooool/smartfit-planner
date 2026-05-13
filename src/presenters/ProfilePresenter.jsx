import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { planStore } from "../model/planStore";
import { uiStore } from "../model/uiStore";
import { userStore } from "../model/userStore";
import { logoutUser, updateUsername } from "../persistence/authRepo";
import { ProfileView } from "../views/ProfileView";

export default observer(function ProfilePresenter() {
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to log out?")) {
        logoutUser();
      }
    } else {
      setLogoutModalVisible(true);
    }
  }

  function onConfirmLogoutACB() {
    setLogoutModalVisible(false);
    logoutUser();
  }

  function onCancelLogoutACB() {
    setLogoutModalVisible(false);
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

  async function onUpdateUsernameACB(newName) {
    try {
      await updateUsername(newName);
      uiStore.showToast("Username updated!", "success");
    } catch (err) {
      uiStore.showToast(err.message || "Failed to update username", "error");
    }
  }

  function getTodayWorkoutSeconds() {
    const today = new Date().toISOString().split("T")[0];
    return planStore.workoutTimeLog[today] || 0;
  }

  function getTotalWorkoutSeconds() {
    const log = planStore.workoutTimeLog || {};
    return Object.values(log).reduce(function sumCB(acc, val) { return acc + (val || 0); }, 0);
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
      logoutModalVisible={logoutModalVisible}
      onConfirmLogout={onConfirmLogoutACB}
      onCancelLogout={onCancelLogoutACB}
      onUpdateUsername={onUpdateUsernameACB}
      todayWorkoutSeconds={getTodayWorkoutSeconds()}
      totalWorkoutSeconds={getTotalWorkoutSeconds()}
      workoutTimeLog={planStore.workoutTimeLog}
    />
  );
});
