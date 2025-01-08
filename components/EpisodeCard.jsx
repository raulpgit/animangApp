import {View, Text, Pressable, ScrollView} from "react-native";
import {FontAwesome6, FontAwesome} from "@expo/vector-icons";
import {memo, useCallback, useEffect, useState} from "react";
import {AddorWatchEpisode, getEpisodeSaved} from "../lib/DBManager";



const EpisodeCard = ({episode,animeID,SchemeColor}) =>{
    const {
        mal_id,
        title,
        title_japanese,
        title_romanji
    } = episode;

    const [watched, setWatched] = useState(null);
    const [episodeSaved, setEpisodeSaved] = useState(0);


    useEffect(() => {
        getEpisodeSaved(animeID,episode.mal_id).then((result) => {
            (result.length !== 0) ? (setWatched(result[0].watched),setEpisodeSaved(result[0])) : setWatched(false);
            // console.log(result);
        });
    }, [watched]);

    const checkEye = useCallback(() => {
        setWatched(!watched);
        console.log("set watched");
    },[watched]);

    return (
        <View key={mal_id} style={[styles.Card,watched===null ? ({display: "none"}) : (watched ?
            {backgroundColor: SchemeColor.background, borderWidth:2, borderColor: SchemeColor.title} :
            {backgroundColor: SchemeColor.title,})]}>
            <View style={[styles.numshow, watched ?
                {borderColor: SchemeColor.title}:
                {borderColor: SchemeColor.background,}]}>
                    <View style={{justifyContent:"flex-end",alignItems:"flex-end",flexDirection:"row"}}>
                        <Text style={[styles.Title,{textAlign:"left"}, watched ?
                        {color:SchemeColor.title,}:
                        {color:SchemeColor.background,}]}>{mal_id}</Text>
                    </View>
                    <View style={{flexWrap:"wrap",flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                        {episodeSaved.rating > 0 ? (
                            episodeSaved.rating > 1 ? (
                                    <FontAwesome name="star" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                ) :
                                (
                                    <FontAwesome name="star-half-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                )
                        ) : (
                            <FontAwesome name="star-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                        )
                        }
                        {episodeSaved.rating > 2 ? (
                            episodeSaved.rating > 3 ? (
                                    <FontAwesome name="star" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                ) :
                                (
                                    <FontAwesome name="star-half-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                )
                        ) : (
                            <FontAwesome name="star-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                        )
                        }
                        {episodeSaved.rating > 4 ? (
                            episodeSaved.rating > 5 ? (
                                    <FontAwesome name="star" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                ) :
                                (
                                    <FontAwesome name="star-half-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                )
                        ) : (
                            <FontAwesome name="star-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                        )
                        }
                        {episodeSaved.rating > 6 ? (
                            episodeSaved.rating > 7 ? (
                                    <FontAwesome name="star" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                ) :
                                (
                                    <FontAwesome name="star-half-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                )
                        ) : (
                            <FontAwesome name="star-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                        )
                        }
                        {episodeSaved.rating > 8 ? (
                            episodeSaved.rating > 9 ? (
                                    <FontAwesome name="star" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                ) :
                                (
                                    <FontAwesome name="star-half-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                                )
                        ) : (
                            <FontAwesome name="star-o" size={15} color={watched? SchemeColor.text : SchemeColor.background}/>
                        )
                        }
                    </View>
            </View>
            <View style={{flex:5, justifyItems:"center", alignItems:"Left",flexDirection:"column"}}>
                <Text style={[styles.Title, watched ?
                    {color:SchemeColor.title,}:
                    {color:SchemeColor.background}]}>{title}</Text>
                <View style={{flex:1,flexDirection:"row",flexWrap:"wrap"}}>
                    <ScrollView horizontal>
                        <Text style={[styles.Label,{color:SchemeColor.text, borderColor: SchemeColor.title, backgroundColor: SchemeColor.background+"a0",}]}>{title_japanese}</Text>
                        <Text style={[styles.Label,{color:SchemeColor.text, borderColor: SchemeColor.title, backgroundColor: SchemeColor.background+"a0",}]}>{title_romanji}</Text>
                    </ScrollView>
                    
                </View>
            </View>
            <Pressable style={styles.eyeTrack} onPress={checkEye}>
                {watched ? (
                    <FontAwesome6 name="eye-slash" size={20} color={SchemeColor.title} />
                ):
                (
                    <FontAwesome6 name="eye" size={20} color={SchemeColor.background} />
                )}
            </Pressable>
        </View>
    )
}

export default memo(EpisodeCard);

const styles = {
    Card: {
        flex: 1,
        width: "95%",
        height: "auto",
        margin: 5,
        justifyItems: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    eyeTrack:{
        flex: 1,
        padding:10,
    },
    numshow:{
        width: "100%",
        height: "100%",
        flex: 1,
        borderRightWidth: 2,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        padding: 5,
        alignItems:"center",
        justifyContent: 'space-between',
        flexDirection: "column",
    },
    Title:{
        marginLeft: 5,
        fontSize: 20,
        fontWeight: "bold",
    },
    Label:{
        padding:5,
        margin:2,
        fontSize:10,
        fontWeight:"600",
        // color:SchemeColor.text,
        borderStyle: "solid",
        // borderColor: SchemeColor.title,
        borderWidth: 1,
        borderRadius: 5,
        // backgroundColor: SchemeColor.background+"a0",
    },
}