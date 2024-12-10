import {View, FlatList, ActivityIndicator} from "react-native";
import {useEffect, useState} from "react";
import {getAnimeTop} from "../../lib/animeApi";
import {AnimeCard} from "../../components/AnimeCard";

export default function Search(){
    const [animes, setAnimes] = useState([]);
    // let num = 1; // For future use to make pagination

    useEffect(() => {
        getAnimeTop().then((animes) => setAnimes(animes));
    }, []);
    return (
        <View style={styles.container}>
            {animes.length === 0? (
                <ActivityIndicator color={"black"} size={40}/>
                ):(
                <FlatList data={animes} style={styles.flatlist} numColumns={3} keyExtractor={anime => anime.mal_id}
                          renderItem={({ item }) => (<AnimeCard key={item.mal_id} anime={item}/>)}>
                </FlatList>
                )}
            {/*<Button title={"Next"} onPress={() => getAnimeTop(num).then((animes) => setAnimes(animes))}/>*/ /*For future use to make pagination*/}
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
    }
}