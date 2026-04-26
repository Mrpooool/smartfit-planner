import { Stack } from "expo-router";
import { reaction } from "mobx";
import { useEffect } from "react";
import { userStore } from "../src/model/userStore";
import { connectAuth } from "../src/persistence/authRepo";
import { connectToPersistence } from "../src/persistence/planRepo";
import { connectUserPrefsPersistence } from "../src/persistence/userPrefsRepo";
import { GlobalToast } from "../src/views/common/GlobalToast";

export default function RootLayout() {
  useEffect(function onMountACB() {
    // 1. Listen for Firebase Auth state changes (sets userStore.uid/ready)
    connectAuth();

    // 2. Use MobX reaction to watch userStore.uid changes.
    //    This replaces the previous useEffect([userStore.uid]) approach,
    //    which caused an ESLint exhaustive-deps warning because MobX
    //    observables are not valid React hook dependencies.
    let disconnectPlanPersistence = null;
    let disconnectUserPrefsPersistence = null;

    const stopUidReaction = reaction(
      () => userStore.uid,                     // data function: track uid
      (uid) => {                               // effect function: runs when uid changes
        disconnectPlanPersistence?.();
        disconnectUserPrefsPersistence?.();
        disconnectPlanPersistence = null;
        disconnectUserPrefsPersistence = null;
        if (uid) {
          disconnectPlanPersistence = connectToPersistence(uid, reaction);
          disconnectUserPrefsPersistence = connectUserPrefsPersistence(uid, reaction);
        }
      },
      { fireImmediately: true }                // run once at startup too
    );

    return function onCleanupACB() {
      stopUidReaction();
      disconnectPlanPersistence?.();
      disconnectUserPrefsPersistence?.();
    };
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="plan" options={{ title: "Plan" }} />
        <Stack.Screen name="action/[id]" options={{ title: "Action Details", headerBackTitle: "Back" }} />
        <Stack.Screen name="details" options={{ title: "Exercise Details", headerBackTitle: "Back" }} />
        <Stack.Screen name="planPreview" options={{ title: "Preview Plan", headerBackTitle: "Back" }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack>
      <GlobalToast />
    </>
  );
}
