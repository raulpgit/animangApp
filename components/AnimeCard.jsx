import {Image, Text, View, Pressable} from "react-native";
import {Link, useFocusEffect} from "expo-router";
import {defaultColor, getSelectedTheme} from "../lib/Schemes";
import React, { useState } from "react";


export function AnimeCard({anime, SchemeColor}){
    // const [SchemeColor,setSchemeColor] = useState(defaultColor());
          
    // useFocusEffect(
    //     React.useCallback(() => {
    //         getSelectedTheme().then((value) =>setSchemeColor(value));
    //     }, [])
    // );

    return(
        <View key={anime.mal_id} style={[styles.card,{backgroundColor: SchemeColor.title}]}>
            <Link asChild href={`/${anime.mal_id}`}>
                <Pressable>
                    <Image source={{uri: anime.image}} style={styles.image} />
                    <View style={{alignItems:"center", justifyContent:"center", paddingLeft:2, paddingRight:2}}>
                        <Text key={anime.mal_id} style={[styles.text,{color: SchemeColor.background,}]}>{anime.title}</Text>
                    </View>
                </Pressable>
            </Link>
        </View>
    );
}
const styles = {
    card: {
        // width: 150,
        // height: 100,
        flex: 1,
        margin: 10,
        paddingBottom: 3,
        // borderColor: color.title,
        // borderWidth: 1,
        borderRadius: 10,
        
    },
    image: {
        flex:1,
        // width: 100,
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    text: {
        flex:1,
        fontSize:15,
        fontWeight: "bold",
    },
}