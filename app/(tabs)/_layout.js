import {Tabs} from "expo-router";
import {Feather} from "@expo/vector-icons";


export default () => {

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' , headerShown:false}}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color}/>,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="config"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}