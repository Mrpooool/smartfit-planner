import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { observer } from "mobx-react-lite";
import { Text, View } from "react-native";
import { userStore } from "../../src/model/userStore";
import { colors } from "../../src/theme";

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
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: function renderHomeIconACB({ color, size, focused }) {
            return <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />;
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
