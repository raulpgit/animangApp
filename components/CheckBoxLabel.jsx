import {View, Text, Pressable} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import React, { useState } from "react";
import { defaultColor, getSelectedTheme } from "../lib/Schemes";
import { useFocusEffect } from "expo-router";

export default function CheckBoxLabel({LabelName,LabelID, onToggle, SchemeColor}){
    const [check,setCheck] = useState(false);
    // const [SchemeColor,setSchemeColor] = useState(defaultColor());
        
        
    // useFocusEffect(
    //     React.useCallback(() => {
    //         getSelectedTheme().then((value) =>setSchemeColor(value));
    //     }, [])
    // );

    const handlePress = () => {
        console.log("Checked "+LabelName);
        setCheck(!check);
        onToggle(LabelID, !check);
    };


    return (
        <View style={{flex:1, flexDirection:"column"}}>
            <Pressable  style={{flex:1,}} onPress={() => handlePress()}>
                {check?
                (
                    <MaterialCommunityIcons name="checkbox-marked" size={40} color={SchemeColor.text} />
                ):
                (
                    <MaterialCommunityIcons name="checkbox-blank-outline" size={40} color={SchemeColor.text} />
                )}
                <Text style={{color:SchemeColor.text, flex:1}}>{LabelName}</Text>
            </Pressable>
        </View>
    );
}