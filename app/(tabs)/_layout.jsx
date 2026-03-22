import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Generator",
          tabBarIcon: function renderGeneratorIconACB() {
            return <Text>⚡</Text>;
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: function renderExploreIconACB() {
            return <Text>🔍</Text>;
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
}
