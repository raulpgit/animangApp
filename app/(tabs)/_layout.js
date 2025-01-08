import {Tabs} from "expo-router";
import {Feather} from "@expo/vector-icons";
import { defaultColor, getSelectedTheme } from "../../lib/Schemes";
import React, { useCallback, useEffect, useState } from "react";


export default () => {
    const [SchemeColor,setSchemeColor] = useState(defaultColor());
        
    useEffect(() => {
        console.log("ChangingThemeTab")
            getSelectedTheme().then((value) =>setSchemeColor(value));
        }, [])
        
    // const updateTheme = (themeName) => {
    //     const newScheme = themeName ? setSelectedScheme(themeName) : defaultColor();
    //     setSchemeColor(newScheme);
    // };
    
    return (
        <Tabs screenOptions={{
            tabBarInactiveTintColor: SchemeColor.title,
            tabBarInactiveBackgroundColor: SchemeColor.background,
            tabBarActiveTintColor: SchemeColor.background ,
            tabBarActiveBackgroundColor: SchemeColor.title,
            animation:"shift",
            headerShown:false,
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color}/>,
                }}
                // listeners={{
                //     tabPress: handleUpdateScheme
                // }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
                }}
                // listeners={{
                //     tabPress: handleUpdateScheme
                // }}
            />
            <Tabs.Screen
                name="config"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
                }}
                // listeners={{
                //     tabPress: handleUpdateScheme
                // }}
            />
        </Tabs>
    );
}