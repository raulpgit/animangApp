import {Image, Text, View, Pressable} from "react-native";
import {Link} from "expo-router";
import {useEffect, useState} from "react";
import {FontAwesome, FontAwesome6} from "@expo/vector-icons";

export function AnimeSavedCard({anime}){
    const [actualEpisode, setActualEpisode] = useState(0);
    useEffect(() => {
        if(anime.last_watched !== null) setActualEpisode(anime.last_watched);
    }, [anime]);

    return(
        <View key={anime.mal_id} style={styles.card}>
            <Link asChild href={`/${anime.mal_id}`}>
                <Pressable style={styles.ContentCard}>
                    <Image source={{uri: anime.image}} style={styles.image} />
                    <View style={{flex: 2,justifyContent: "space-around", padding:10}}>
                        <Text key={anime.mal_id} style={{fontSize:20, fontWeight:"bold"}}>{anime.title}</Text>
                        <View>
                            <Text>Episodes:{anime.episodes}</Text>
                            <Text>{actualEpisode > 0 ? actualEpisode : "not started yet"}</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <FontAwesome name="star" size={30} color="black" />
                            <FontAwesome name="star" size={30} color="black" />
                            <FontAwesome name="star-half-o" size={30} color="black" />
                            <FontAwesome name="star-o" size={30} color="black" />
                            <FontAwesome name="star-o" size={30} color="black" />
                        </View>
                    </View>
                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <Pressable style={styles.Button}
                            onPress={() => setActualEpisode(actualEpisode+1)}
                            onLongPress={() => setActualEpisode(0)}
                        >
                            <FontAwesome6 name="eye" size={60} color="black" />
                        </Pressable>
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
        // margin: 10,
        padding: 10,
        // backgroundColor: "lightgray",
    },
    image: {
        width: 100,
        height: 180,
        // borderRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    Button:{
        backgroundColor: "#7CB9E8",
        borderRadius: 40,
        padding: 5,
        alignItems: "center",
    },
    ContentCard:{
        flexDirection:"row",
        backgroundColor:"lightgray",
        borderRadius: 10,
    }
}