import {View, FlatList, ActivityIndicator, Pressable,Text, TextInput} from "react-native";
import React,{useEffect, useState} from "react";
import {getAnimeSearch, getAnimeTop} from "../../lib/animeApi";
import {AnimeCard} from "../../components/AnimeCard";
import {blue, defaultColor, getSelectedTheme} from "../../lib/Schemes";
import { Stack, useFocusEffect } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";


export default function Search(){
    const [animes, setAnimes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [SchemeColor,setSchemeColor] = useState(defaultColor());
        
        
    useFocusEffect(
        React.useCallback(() => {
            getSelectedTheme().then((value) =>setSchemeColor(value));
        }, [])
    );

    useFocusEffect(
            React.useCallback(() => {
                setSearchText('');
                getAnimeTop().then((animes) => setAnimes(animes));
            }, [])
        );
    return (
        <View style={[styles.container,{backgroundColor: SchemeColor.background,}]}>
            <View style={{flex:1,flexDirection:"row", alignItems:"center", justifyItems:"center"}}>
                <TextInput style={[styles.SearchBar,{color:SchemeColor.title,left:5,}]}
                    onChangeText={(value) => setSearchText(value)}
                    value={searchText}
                    placeholder="Search an Anime..."
                    placeholderTextColor={SchemeColor.text+"a0"}
                    keyboardType="default"
                />
                <Pressable style={{right:15}}
                onPress={() => getAnimeSearch(searchText).then((animes) => setAnimes(animes))}>
                    <FontAwesome5 name="search" size={30} color={SchemeColor.text}/>
                </Pressable>
            </View>
            <View style={{flex:10, flexDirection:"row"}}>
            {animes.length === 0? (
                <ActivityIndicator color={SchemeColor.icons} size={40}/>
                ):(
                    <FlatList data={animes} style={styles.flatlist} numColumns={3} keyExtractor={anime => anime.mal_id}
                            renderItem={({ item }) => (<AnimeCard key={item.mal_id} anime={item} SchemeColor={SchemeColor}/>)}>
                    </FlatList>
                )}
            </View>
            {/*<Button title={"Next"} onPress={() => getAnimeTop(num).then((animes) => setAnimes(animes))}/>*/ /*For future use to make pagination*/}
        </View>
    );
}
const styles = {
    container: {
        flex: 1,
        // backgroundColor: SchemeColor.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlist:{
        // flexDirection: "row",
        // flex:1,
        // flexWrap: "wrap",
        width: "100%",
    },
    SearchBar:{
        flex:1,
        marginLeft: 5,
        fontSize: 20,
        fontWeight: "bold",
        // color:SchemeColor.background,
    }
}