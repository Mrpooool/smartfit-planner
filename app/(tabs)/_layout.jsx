import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import { View, Text } from "react-native";
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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: function renderHomeIconACB({ color, size, focused }) {
            return <Ionicons name={focused ? "flash" : "flash-outline"} color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: function renderSearchIconACB({ color, size, focused }) {
            return <Ionicons name={focused ? "search" : "search-outline"} color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: function renderPlanIconACB({ color, size, focused }) {
            return <Ionicons name={focused ? "barbell" : "barbell-outline"} color={color} size={size} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: function renderProfileIconACB({ color, size, focused }) {
            return <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />;
          },
        }}
      />
    </Tabs>
  );
});