import {ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, Text, View} from "react-native";
import {Link,Stack} from "expo-router";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {getAnime} from "../lib/animeApi";
import {AddAnime, RemoveAnime, getAnimeSaved} from "../lib/DBManager";
import {blue} from "../lib/Schemes";



const color = blue();
export default function Detail() {
    const {id} = useLocalSearchParams();
    const [anime, setAnime] = useState(0);
    const [episodes, setEpisodes] = useState(0);
    const [saved, setSaved] = useState(false);
    const [expandedSynopsis, setExpanded] = useState(false);
    // const [transparentHeader, setTH] = useState(true); // This is for the future header

    useEffect(() => {
        getAnime(id).then((anime) => setAnime(anime));
    }, [id]);

    useEffect(() => {
        getAnimeSaved(id).then((saved) => setSaved(saved));
    }, [id]);

    useEffect(() => {
        if(anime !== 0){
            if(anime.synopsis.length > 500){
                setExpanded(false);
            }else{
                setExpanded(true);
            }
        }
    }, [anime]);

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerTintColor: color.icons,
                    headerRight: () => (
                        saved ? (
                            <Pressable style={{}} onPressOut={() => RemoveAnime(id).then(() => setSaved(false))}>
                                <FontAwesome name="bookmark" size={30} color={color.icons} />
                            </Pressable>
                        ) : (
                            <Pressable style={{}} onPressOut={() => AddAnime(id, anime.title, anime.image, anime.synopsis, anime.episodes).then(() => setSaved(true))}>
                                <FontAwesome name="bookmark-o" size={30} color={color.icons} />
                            </Pressable>
                        )
                    ),
                }}
            />
            {anime === 0 ? (
                <ActivityIndicator color={color.icons} size={40}/>
            ) : (
                <View style={{flex:1,alignItems: 'center', justifyContent: 'center',width: "100%",}}>
                    <ScrollView>
                    <ImageBackground source={{uri: anime.image}} style={styles.BackgroundImage}>
                        <View style={styles.ImageContainer}>
                            <Image source={{uri: anime.image}} style={styles.image} />
                            <View style={styles.TitleContainer}>
                                <Text style={{flex:1,fontSize:30,fontWeight:"bold",color:color.title}}>{anime.title}</Text>
                                <Text style={{flex:1,fontSize:20,fontWeight:"500",fontStyle:"italic",color:color.title}}>Episodes: {anime.episodes}</Text>
                                <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                {anime.genres.map((genre) => (
                                    <Text key={genre.mal_id} style={styles.GenreLabel}>{genre.name}</Text>
                                ))}
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{flex:1,alignItems: 'center',
                        justifyContent: 'center',}}>
                        <Text style={{
                            color:color.text,
                            height: expandedSynopsis ? "auto" : 100,
                        }}>{anime.synopsis}</Text>
                    </View>
                        <View style={{justifyContent:"center",alignItems:"center"}}>
                            {expandedSynopsis ? (
                                anime.synopsis.length > 500? (
                                    <Pressable onPress={() => setExpanded(false)}>
                                        <MaterialIcons name="keyboard-arrow-up" size={24} color={color.icons} />
                                    </Pressable>
                                ):(<Text></Text>)
                                ):(
                                anime.synopsis.length > 500? (
                                <Pressable onPress={() => setExpanded(true)}>
                                    <MaterialIcons name="keyboard-arrow-down" size={24} color={color.icons} />
                                </Pressable>
                                ):(<Text></Text>))
                            }
                        </View>
                    <View style={{flex:1,alignItems: 'center', justifyContent: 'center',}}>
                    </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        // padding: 10,
        backgroundColor: color.background,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
    flatlist: {
        width: "100%",
    },
    image: {
        flex:1,

        marginTop:50,
        margin:10,

        width: 200,
        height: 300,
        borderRadius: 10,
        opacity: 1,
    },
    ImageContainer:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        backgroundColor:'#000000a0',
    },
    BackgroundImage:{
        flex:1,
        width: "100%",
        resizeMode: "contain",
        justifyContent: 'center',
        alignItems: 'center',
    },
    TitleContainer:{
        marginTop:50,
        margin:10,
        marginBottom:0,
        flex:1,
        flexDirection:"column"

    },
    GenreLabel:{
        padding:5,
        margin:5,
        fontSize:15,
        fontWeight:"100",
        color:color.text,
        borderStyle: "solid",
        borderColor: color.title,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: color.background+"a0",
    },
    // Synopsis:
};