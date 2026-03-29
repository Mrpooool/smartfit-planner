import { Redirect, Tabs } from "expo-router";
import { observer } from "mobx-react-lite";
import { Text, View } from "react-native";
import { userStore } from "../../src/model/userStore";

export default observer(function TabsLayout() {
  if (!userStore.ready) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userStore.uid) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: function renderHomeIconACB() {
            return <Text>🏠</Text>;
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: function renderSearchIconACB() {
            return <Text>🔍</Text>;
          },
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: function renderPlanIconACB() {
            return <Text>📋</Text>;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: function renderProfileIconACB() {
            return <Text>👤</Text>;
          },
        }}
      />
    </Tabs>
  );
});