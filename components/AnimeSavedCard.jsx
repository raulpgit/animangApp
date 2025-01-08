import {Image, Text, View, Pressable} from "react-native";
import {Link, useFocusEffect} from "expo-router";
import React, {useEffect, useState,memo, useCallback} from "react";
import {FontAwesome, FontAwesome6} from "@expo/vector-icons";
import {AddorWatchEpisode} from "../lib/DBManager";
import { defaultColor, getSelectedTheme } from "../lib/Schemes";


// const color = blue();

const AnimeSavedCard = ({anime, onModal,SchemeColor}) => {
    const{
        mal_id,
        image,
        title,
        episodes,
        last_watched,
    } = anime;

    const [actualEpisode, setActualEpisode] = useState(0);
    // const [SchemeColor,setSchemeColor] = useState(defaultColor());
    
    
    // useFocusEffect(
    //     React.useCallback(() => {
    //         getSelectedTheme().then((value) =>setSchemeColor(value));
    //     }, [])
    // );

    useEffect(() => {
        if(last_watched !== null) setActualEpisode(last_watched);
    }, [anime]);

    const handleWatchEpisode = useCallback(() => {
        watchEpisode(mal_id,actualEpisode+1,episodes),
        actualEpisode < episodes ? setActualEpisode(actualEpisode+1) : setActualEpisode(actualEpisode)
    },[actualEpisode]);

    return(
        <View key={mal_id} style={styles.card}>
            <Link asChild href={`/${mal_id}`}>
                <Pressable style={{backgroundColor:SchemeColor.title,flexDirection:"row",borderRadius: 10,}}>
                    <Image source={{uri: image}} style={styles.image} />
                    <View style={{flex: 2,justifyContent: "space-around", padding:10}}>
                        <Text key={mal_id} style={{fontSize:20, fontWeight:"bold",color:SchemeColor.background}}>{title}</Text>
                        <View>
                            <Text style={{color: SchemeColor.background}}>Episodes:{episodes}</Text>
                            <Text style={{color: SchemeColor.background}}>{actualEpisode > 0 ? actualEpisode : "not started yet"}</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <FontAwesome name="star" size={30} color={SchemeColor.background} />
                            <FontAwesome name="star" size={30} color={SchemeColor.background} />
                            <FontAwesome name="star-half-o" size={30} color={SchemeColor.background} />
                            <FontAwesome name="star-o" size={30} color={SchemeColor.background} />
                            <FontAwesome name="star-o" size={30} color={SchemeColor.background} />
                        </View>
                    </View>
                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <Pressable style={({pressed}) =>[styles.Button,{backgroundColor: pressed ? SchemeColor.text : SchemeColor.background,}] }
                            onPress={handleWatchEpisode}
                            onLongPress={onModal}
                        >
                            {({pressed}) => (
                                <FontAwesome6 name="eye" size={60} color={pressed? SchemeColor.background : SchemeColor.title}/>
                            )}
                        </Pressable>
                    </View>
                </Pressable>
            </Link>
        </View>
    );
};

export default AnimeSavedCard;

async function watchEpisode(animeID,episodeID, episodes){
    if(episodeID >= episodes && episodeID > 1){
        console.log("Anime Finished");
        return;
    }
    await AddorWatchEpisode(animeID,episodeID,null,null,true);
    // setActualEpisode(episodeID);
}
const styles = {
    card: {
        flex: 1,
        padding: 10,
    },
    image: {
        width: 100,
        height: 180,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    Button:{
        borderRadius: 40,
        padding: 5,
        alignItems: "center",
    },
    // ContentCard:{
    //     flexDirection:"row",borderRadius: 10,
    // }
}