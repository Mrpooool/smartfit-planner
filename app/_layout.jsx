import { Stack } from "expo-router";
import { reaction } from "mobx";
import { useEffect } from "react";
import { userStore } from "../src/model/userStore";
import { connectAuth } from "../src/persistence/authRepo";
import { connectToPersistence } from "../src/persistence/planRepo";

export default function RootLayout() {
  // 1. Listen for Firebase Auth state changes (sets userStore.uid/ready)
  useEffect(function onMountACB() {
    connectAuth();
  }, []);

  // 2. When user logs in/out, connect/disconnect Firestore persistence
  useEffect(function onUidChangeACB() {
    if (!userStore.uid) return;               // not logged in yet
    const disconnect = connectToPersistence(userStore.uid, reaction);
    return function onCleanupACB() {           // logout or uid change → disconnect
      disconnect();
    };
  }, [userStore.uid]);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="details"
        options={{ title: "Details" }}
      />
    </Stack>
  )
}
