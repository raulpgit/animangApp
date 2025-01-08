import {Stack} from "expo-router";
import {View} from "react-native";
import Footer from "../components/Footer";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { defaultColor, getSelectedTheme } from "../lib/Schemes";
import React, { useCallback, useEffect, useState } from "react";

// export let SchemeColor = "";
export default function StackLayout() {
    const [SchemeColor,setSchemeColor] = useState(defaultColor());
    
    useEffect(() => {
        console.log("ChangingTheme")
            getSelectedTheme().then((value) =>setSchemeColor(value));
        }, [])

    const updateTheme = (themeName) => {
            const newScheme = themeName ? setSelectedScheme(themeName) : defaultColor();
            setSchemeColor(newScheme);
        };

    const insets = useSafeAreaInsets();

    // const handleTheme = useCallback(() =>{
        // getSelectedTheme().then((value) =>SchemeColor = value);
    // },[SchemeColor]);
    // const db =  SQLite.openDatabaseSync('AniManga');
    // setDB("AniManga");

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: SchemeColor.background}}>
        <StatusBar style="light" />
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                }}/>
            </Stack>
            {/*<Footer/>*/}
        </SafeAreaProvider>
    </View>
  );
}