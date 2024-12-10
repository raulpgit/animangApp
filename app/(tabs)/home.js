import {View, FlatList} from "react-native";
import React, {useEffect, useState} from "react";
import {createTable,getAnimesSaved} from "../../lib/DBManager";
import {AnimeSavedCard} from "../../components/AnimeSavedCard";
import {useFocusEffect} from "expo-router";

export default function Home(){
    const [animes, setAnimes] = useState([]);
    //---------------------------------DB THINGS---------------------------------
    createTable();
    //---------------------------------------------------------------------------
    useFocusEffect(
        React.useCallback(() => {
            getAnimesSaved().then((animes) => setAnimes(animes));
        }, [])
    );

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FlatList data={animes} style={styles.flatlist} numColumns={1} keyExtractor={anime => anime.mal_id}
                      renderItem={({ item }) => (<AnimeSavedCard key={item.mal_id} anime={item}/>)}>
            </FlatList>
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
