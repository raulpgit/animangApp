import {Image, Text, View, Pressable} from "react-native";
import {Link} from "expo-router";

export function AnimeCard({anime}){
    return(
        <View key={anime.mal_id} style={styles.card}>
            <Link asChild href={`/${anime.mal_id}`}>
                <Pressable>
                    <Image source={{uri: anime.image}} style={styles.image} />
                    <View style={{alignItems:"center", justifyContent:"center", paddingLeft:2, paddingRight:2}}>
                        <Text key={anime.mal_id} style={styles.text}>{anime.title}</Text>
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
        borderRadius: 10,
        backgroundColor: "lightgray",
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
        color: "black",
        fontWeight: "bold",
    },
}