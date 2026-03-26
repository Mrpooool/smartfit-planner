import { Redirect } from "expo-router";
import { observer } from "mobx-react-lite";
import { Text, View } from "react-native";
import { userStore } from "../src/model/userStore";

export default observer(function IndexPage() {
  if (!userStore.ready) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (userStore.uid) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
});