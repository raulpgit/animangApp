import {Image, Text, View, Pressable} from "react-native";
import {Link} from "expo-router";

export function AnimeCard({anime}){
    return(
        <View key={anime.mal_id} style={styles.card}>
            <Link asChild href={`/${anime.mal_id}`}>
                <Pressable>
                    <Text key={anime.mal_id}>{anime.title}</Text>
                    <Image source={{uri: anime.image}} style={styles.image} />
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
        padding: 10,
        backgroundColor: "lightgray",
    },
    image: {
        width: 100,
        height: 200,
        borderRadius: 10,
    }
}