import {ActivityIndicator, Image, Pressable, Text, View} from "react-native";
import {Link,Stack} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {getAnime} from "../lib/animeApi";
import {AddAnime, RemoveAnime, getAnimeSaved} from "../lib/DBManager";

export default function Detail() {
    const {id} = useLocalSearchParams();
    const [anime, setAnime] = useState(0);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getAnime(id).then((anime) => setAnime(anime));
    }, [id]);

    useEffect(() => {
        getAnimeSaved(id).then((saved) => setSaved(saved));
    }, [id]);

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerRight: () => (
                        saved ? (
                            <Pressable style={{}} onPressOut={() => RemoveAnime(id).then(() => setSaved(false))}>
                                <FontAwesome name="bookmark" size={30} color="black" />
                            </Pressable>
                        ) : (
                            <Pressable style={{}} onPressOut={() => AddAnime(id, anime.title, anime.image, anime.synopsis, anime.episodes).then(() => setSaved(true))}>
                                <FontAwesome name="bookmark-o" size={30} color="black" />
                            </Pressable>
                        )
                    ),
                }}
            />
            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
                {anime === 0 ? (
                    <ActivityIndicator color={"black"} size={40}/>
                ) : (
                    <>
                        {/*<Link asChild href={"/search"}>*/}
                        {/*    <FontAwesome name="angle-left" size={64} color="black" />*/}
                        {/*</Link>*/}
                        {/*{saved ? (*/}
                        {/*    <Pressable style={{}} onPressOut={() => RemoveAnime(id).then(() => setSaved(false))}>*/}
                        {/*        <FontAwesome name="bookmark" size={64} color="black" />*/}
                        {/*    </Pressable>*/}
                        {/*) : (*/}
                        {/*    <Pressable style={{}} onPressOut={() => AddAnime(id, anime.title, anime.image, anime.synopsis, anime.episodes).then(() => setSaved(true))}>*/}
                        {/*        <FontAwesome name="bookmark-o" size={64} color="black" />*/}
                        {/*    </Pressable>*/}
                        {/*)}*/}
                    </>
                )}
            </View>
            <View style={{flex:4}}>
                <Image source={{uri: anime.image}} style={styles.image} />
                <Text>{anime.title}</Text>
                <Text>{anime.synopsis}</Text>
            </View>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'gray',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    flatlist: {
        width: "100%",
    },
    image: {
        width: 100,
        height: 200,
        borderRadius: 10,
    }
};