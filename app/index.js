import { Redirect, Stack, useFocusEffect } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { defaultColor, getSelectedTheme } from "../lib/Schemes";

export default function Index() {
    const [redirect, setRedirect] = useState(false);
    // const [SchemeColor,setSchemeColor] = useState({});
    // const SchemeColor = getSelectedTheme();
    // console.log(SchemeColor);
    const [SchemeColor,setSchemeColor] = useState(defaultColor());


    useEffect(() =>{
            getSelectedTheme().then((value) =>setSchemeColor(value));
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setRedirect(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:SchemeColor.background}}>
            <Stack.Screen options={{headerShown: false}}/>
            <Text style={{fontSize:30, fontStyle:"italic", fontWeight:"bold", color:SchemeColor.text}}>ANIMANGAPP</Text>
            {redirect && <Redirect href="/home" />}
        </View>
    );
}
