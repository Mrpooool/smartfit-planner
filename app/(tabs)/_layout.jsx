import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { observer } from "mobx-react-lite";
import { Platform, StyleSheet, Text, View } from "react-native";
import { userStore } from "../../src/model/userStore";
import { colors, shadow } from "../../src/theme";

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
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
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
        name="timer"
        options={{
          title: "Timer",
          tabBarIcon: function renderTimerIconACB({ color, size, focused }) {
            return <Ionicons name={focused ? "stopwatch" : "stopwatch-outline"} color={color} size={size} />;
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

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 88 : 64,
    paddingTop: 4,
    borderTopWidth: 0,
    backgroundColor: colors.card,
    ...shadow.md,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
