import {Redirect,Stack} from "expo-router";
import {useEffect, useState} from "react";
import {View,Text} from "react-native";

export default function Index() {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRedirect(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"black"}}>
            <Stack.Screen options={{headerShown: false}}/>
            <Text style={{fontSize:30, fontStyle:"italic", fontWeight:"bold", color:"white"}}>ANIMANGAPP</Text>
            {redirect && <Redirect href="/home" />}
        </View>
    );
}
