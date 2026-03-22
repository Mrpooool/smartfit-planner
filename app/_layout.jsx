import { Stack } from "expo-router";
import { observer } from "mobx-react-lite";
import { userStore } from "../src/model/userStore";
import { AsyncStateView } from "../src/views/common/AsyncStateView";

export default observer(RootLayout);

function RootLayout() {
  // Wait for Firebase Auth state to resolve before rendering
  if (!userStore.ready)
    return <AsyncStateView promise="loading" />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ title: "Workout Details" }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
