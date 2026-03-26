import { useEffect } from "react";
import { Stack } from "expo-router";
import { reaction } from "mobx";
import { connectAuth } from "../src/persistence/authRepo";
import { connectToPersistence } from "../src/persistence/planRepo";
import { userStore } from "../src/model/userStore";

export default function RootLayout() {
  useEffect(function onMountACB() {
    // 1. Listen for Firebase Auth state changes (sets userStore.uid/ready)
    connectAuth();

    // 2. Use MobX reaction to watch userStore.uid changes.
    //    This replaces the previous useEffect([userStore.uid]) approach,
    //    which caused an ESLint exhaustive-deps warning because MobX
    //    observables are not valid React hook dependencies.
    let disconnectPersistence = null;

    const stopUidReaction = reaction(
      () => userStore.uid,                     // data function: track uid
      (uid) => {                               // effect function: runs when uid changes
        disconnectPersistence?.();              // clean up previous connection
        disconnectPersistence = null;
        if (uid) {
          disconnectPersistence = connectToPersistence(uid, reaction);
        }
      },
      { fireImmediately: true }                // run once at startup too
    );

    return function onCleanupACB() {
      stopUidReaction();
      disconnectPersistence?.();
    };
  }, []);

  return <Stack />;
}
