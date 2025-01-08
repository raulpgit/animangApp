import {View, Text, TextInput, Pressable} from "react-native";
import {debugSql, DropTables} from "../../lib/DBManager";
import React, {useState} from "react";
import { handleSelectSave } from "../../lib/Schemes";
import * as Updates from 'expo-updates';
import {Redirect} from "expo-router";

export default function Config(){
    const [debugText, setDebugText] = useState('');

    

    const handleChangeScheme = (value) =>{
        handleSelectSave(value);
        console.log("Theme changed to: " + value);
        Updates.reloadAsync();
        // return( <Redirect href={"/index"}/>);
    }

    return (
        <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex:1, flexDirection:"row"}}>
                <Pressable style={{flex:1,backgroundColor:"darkblue", borderRadius:10, alignItems:"center", justifyContent:"center"}}
                // onPress={() => {handleSelectSave("blue")}}>
                onPress={() => {handleChangeScheme("blue")}}>
                    <Text style={{color:"white", padding:10}}>Set Blue Theme</Text></Pressable>
                <Pressable style={{flex:1,backgroundColor:"darkgray", borderRadius:10, alignItems:"center", justifyContent:"center"}}
                // onPress={() => {handleSelectSave("")}}>
                onPress={() => {handleChangeScheme("")}}>
                    <Text style={{color:"white", padding:10}}>Set Default Theme</Text></Pressable>
            </View>
            <TextInput
                style={{ flex:4,backgroundColor: "white", borderRadius: 10, padding: 10,textAlignVertical: "top", color: "black", width: "90%"}}
                onChangeText={(value) => setDebugText(value)}
                value={debugText}
                placeholder="Set your review here"
                keyboardType="default"
                multiline={true}
            />
            <View style={{flex:1, flexDirection:"row"}}>
                <Pressable style={{backgroundColor: "black",flex:1, width: "20%", justifyContent:"center",alignItems:"center", borderRadius: 10, padding: 10, margin: 10}}
                        onPress={() => debugSql(debugText)}><Text style={{ color: "white"}}>Send</Text></Pressable>
                {/* <Pressable style={{backgroundColor: "brown",flex:1, width: "20%", justifyContent:"center",alignItems:"center", borderRadius: 30, padding: 10, margin: 10}}
                onPress={() => DropTables()}><Text style={{ color: "white"}}>Restore Database</Text></Pressable> */}
            </View>
        </View>
    );
}