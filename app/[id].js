import {Image, Text, View} from "react-native";
import {Link} from "expo-router";
import {Feather} from "@expo/vector-icons";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {getAnime} from "../lib/animeApi";

export default function Detail(){
    const {id} = useLocalSearchParams();
    const [anime, setAnime] = useState(0);

    useEffect(() => {
        getAnime(id).then((anime) => setAnime(anime));
    }, [id]);

    return(
        <View style={styles.container}>
            <Link asChild href={"/search"}>
                <Feather name="arrow-left" size={74} color="black" />
            </Link>
            <Image source={{uri: anime.image}} style={styles.image} />
            <Text>{anime.title}</Text>
            <Text>{anime.synopsis}</Text>
        </View>
    );
}
const styles = {
    container: {
        flex: 1,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlist:{
        // flexDirection: "row",
        // flex:1,
        // flexWrap: "wrap",
        width: "100%",
    },
    image: {
        width: 100,
        height: 200,
        borderRadius: 10,
    }
}