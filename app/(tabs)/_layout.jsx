import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
    return(
        <Tabs>
            <Tabs.Screen
                name = "index"
                options = {{
                    title: "Home",
                    tabBarIcon: function renderHomeIconACB(){
                        return <Text>🏠</Text>
                    }
                }}
            />
            <Tabs.Screen
                name = "explore" 
                options = {{
                    title: "Explore",
                    tabBarIcon: function renderSearchIconACB(){
                        return <Text>🔍</Text>
                    }
                }}
            />
            <Tabs.Screen
                name = "profile"
                options = {{
                    title: "Profile",
                    tabBarIcon: function renderProfileIconACB(){
                        return <Text>👤</Text>
                    }
                }}
            /> 
        </Tabs>

    )
}