import {ActivityIndicator, FlatList, FlatListComponent, Image, ImageBackground, Pressable, ScrollView, Text, View} from "react-native";
import {Stack, useFocusEffect} from "expo-router";
import {FontAwesome, MaterialIcons,AntDesign} from "@expo/vector-icons";
import {useLocalSearchParams} from "expo-router";
import React, {act, useCallback, useEffect, useState} from "react";
import {getAnime, getEpisodes, getMorePages, hasMorePages} from "../lib/animeApi";
import {AddAnime, RemoveAnime, getAnimeSaved, getLabelsOfAnime, GetLabelsToSelect, AddLabelToAnime, RemoveLabelToAnime,GetLabelsofAnimeToSelect} from "../lib/DBManager";
import {defaultColor, getSelectedTheme} from "../lib/Schemes";
import EpisodeCard from "../components/EpisodeCard";
import CheckBoxLabel from "../components/CheckBoxLabel";
import {Modal} from "../components/Modal";


export default function Detail() {
    const {id} = useLocalSearchParams();
    const [anime, setAnime] = useState(0);
    const [episodes, setEpisodes] = useState([]);
    const [saved, setSaved] = useState(false);
    const [expandedSynopsis, setExpanded] = useState(false);
    const [labels, setLabels] = useState([]);
    const [allLabels, setAllLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [enableLabelModal, setLabelModal] = useState(false);
    const [addOrRemoveLabel, setAddOrRemove] = useState(true); //TRUE == ADD || FALSE == REMOVE
    // const [transparentHeader, setTH] = useState(true); // This is for the future header
    const [actualPage,setActualPage] = useState(1);
    const [moreEpisodesFlag,setEpisodeFlag] = useState(false);

    const [nPages, setPages] = useState(0);

    const [SchemeColor,setSchemeColor] = useState(defaultColor());
        
        
    useFocusEffect(
        React.useCallback(() => {
            getSelectedTheme().then((value) =>setSchemeColor(value));
        }, [])
    );

    useEffect(() => {
        getAnime(id).then((anime) => setAnime(anime));
        setLabelModal(false);
    }, [id]);

    useEffect(() => {
        getAnimeSaved(id).then((saved) => setSaved(saved));
        getMorePages(id,actualPage).then((Pages) => {
            console.log("Setting pages: "+Pages.last_visible_page);
            setPages(Pages.last_visible_page)});
    }, [id]);

    useEffect(() => {
        if(!enableLabelModal){
            setAllLabels([]);
            setSelectedLabels([]);
        }
        else{
            GetLabelsofAnimeToSelect(id,addOrRemoveLabel).then((labels) => setAllLabels(labels))
        }
    },[enableLabelModal])

    useEffect(() => {
        GetLabelsofAnimeToSelect(id,addOrRemoveLabel).then((labels) => setAllLabels(labels))
    },[addOrRemoveLabel])

    useEffect(() => {
        if(anime !== 0){
            if(anime.synopsis !== null && anime.synopsis.length > 500){
                setExpanded(false);
            }else{
                setExpanded(true);
            }
        }
    }, [anime]);

    useEffect(() => {
        if(anime.episodes < 2 || (anime.episodes === null && !hasMorePages(id,actualPage)))setEpisodes([{mal_id:1,title:"Movie",title_japanese:"",title_romanji:""}]);
        else getEpisodes(id,actualPage).then((episodes) => setEpisodes(episodes));
    }, [anime]);

    useEffect(()=> {
        console.log("Final de flatlist, intentando llegar a la pagina: "+actualPage)
        if(episodes.length !== 1 ){
            if(moreEpisodesFlag){
                console.log("Entrando, cerrando el flag")
                setEpisodeFlag(false);
                // hasMorePages(id,actualPage).then((result) => 
                // {
                    // if(result){
                    if(nPages >= actualPage){
                        getEpisodes(id,actualPage).then((newEpisodes) => {
                            const allEpisodes = [...episodes,...newEpisodes]
                            // console.log(allEpisodes);
                            setEpisodes(allEpisodes);
                        });
                    }
                // })
            }
        }
    },[actualPage])

    useEffect(() => {
        console.log("Abriendo el flag");
        setEpisodeFlag(true);
    },[episodes])

    useEffect(() => {
        getLabelsOfAnime(id).then((labels) => setLabels(labels));
    }, [enableLabelModal]);

    const handleToggleLabel = useCallback((labelID, isSelected) => {
        setSelectedLabels((prevLabels) => {
            if (isSelected) {
                // console.log("adding label to selected");
                return [...prevLabels, labelID];
            } else {
                // console.log("removing label to selected");
                return prevLabels.filter((label) => label !== labelID);
            }
        });
    },[selectedLabels]);

    const AddLabels = () => {
        console.log("start adding labels into anime");
        for(let i = 0; i < selectedLabels.length; i++){
            AddLabelToAnime(id,selectedLabels[i]);
        }
    };
    const RemoveLabels = () => {
        console.log("start removing labels from anime");
        for(let i = 0; i < selectedLabels.length; i++){
            RemoveLabelToAnime(id,selectedLabels[i]);
        }
    };

    const handleEndReached = useCallback(() => {
        if(nPages === 0)return;
        console.log(actualPage+" || "+nPages);
        if(actualPage < nPages){setActualPage((prevPage) => prevPage + 1)}},[actualPage]);

    const handleSynopsisExpanded = useCallback(() => setExpanded(!expandedSynopsis),[expandedSynopsis]);

    return (
        <View style={[styles.container,{backgroundColor: SchemeColor.background,}]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerTransparent: true,
                    headerTintColor: SchemeColor.icons,
                    headerRight: () => (
                        <View style={{flexDirection:"row", justifyContent:"space-between",gap:20}}>
                        {saved ? (
                            <Pressable style={{}} onPressOut={() => {setLabelModal(true)}}>
                                <MaterialIcons name="label" size={30} color={SchemeColor.icons} />
                            </Pressable>
                        ) : ("")}
                        
                        {saved ? (
                            <Pressable style={{}} onPressOut={() => RemoveAnime(id).then(() => setSaved(false))}>
                                <FontAwesome name="bookmark" size={30} color={SchemeColor.icons} />
                            </Pressable>
                        ) : (
                            <Pressable style={{}} onPressOut={() => AddAnime(id, anime.title, anime.image, anime.synopsis, anime.episodes).then(() => setSaved(true))}>
                                <FontAwesome name="bookmark-o" size={30} color={SchemeColor.icons} />
                            </Pressable>
                        )}
                        </View>
                    ),
                }}
            />
            {anime === 0 ? (
                <ActivityIndicator color={SchemeColor.icons} size={40}/>
            ) : (
                <View style={styles.PrincipalPage}>
                    <FlatList data={episodes} keyExtractor={episode => episode.mal_id} 
                    ListHeaderComponent={<View><ImageBackground source={{uri: anime.image}} style={styles.BackgroundImage}>
                    <View style={styles.ImageContainer}>
                        <Image source={{uri: anime.image}} style={styles.image} />
                        <View style={styles.TitleContainer}>
                            <Text style={[styles.Title,{color:SchemeColor.title}]}>{anime.title}</Text>
                            <Text style={[styles.Episodes,{color:SchemeColor.title}]}>Episodes: {anime.episodes}</Text>
                            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                <FlatList data={labels} style={[styles.flatlist]} horizontal={true} keyExtractor={label => label.id+"label"}
                                          renderItem={({ item }) => (<Text key={item.id+"label"} style={[styles.GenreLabel,{backgroundColor: item.color+"a0", color:SchemeColor.text, borderColor: SchemeColor.title,}]}>{item.name}</Text>)}/>
                            </View>
                            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                            {anime.genres.map((genre) => (
                                <Text key={genre.mal_id+"genre"} style={[styles.GenreLabel,{color:SchemeColor.text, borderColor: SchemeColor.title, backgroundColor: SchemeColor.background+"a0",}]}>{genre.name}</Text>
                            ))}
                            </View>
                        </View>
                    </View>
                </ImageBackground>
                <View style={{flex:1,alignItems: 'center',
                    justifyContent: 'center',}}>
                    <Text style={{
                        color:SchemeColor.text,
                        height: expandedSynopsis ? "auto" : 100,
                    }}>{anime.synopsis}</Text>
                </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        {expandedSynopsis ? (
                            anime.synopsis !== null && anime.synopsis.length > 500? (
                                <Pressable onPress={handleSynopsisExpanded}>
                                    <MaterialIcons name="keyboard-arrow-up" size={24} color={SchemeColor.icons} />
                                </Pressable>
                            ):(<Text></Text>)
                            ):(
                            anime.synopsis !== null && anime.synopsis.length > 500? (
                            <Pressable onPress={handleSynopsisExpanded}>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color={SchemeColor.icons} />
                            </Pressable>
                            ):(<Text></Text>))
                        }
                    </View></View>}
                    renderItem={({ item }) => ( <EpisodeCard key={item.mal_id+"episode"} episode={item} animeID={id} SchemeColor={SchemeColor}/>)}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={10}/>
                </View>
            )}
           {/* -----------------------------LABELS MODAL--------------------------------- */}
            <Modal visible={enableLabelModal} SchemeColor={SchemeColor} width={"90%"} height={"45%"}>
                    <View style={{flex:1,flexDirection:"row", margin:10,
                        justifyItems: 'center',
                        alignCItems: 'center',
                        borderRadius: 10,
                        justifyContent: 'space-between',
                        gap:10,
                    }}>
                        <Pressable style={[{flex:2, borderRadius: 10, padding: 10,justifyContent:"center",alignItems:"center",},
                            addOrRemoveLabel? 
                            {backgroundColor: SchemeColor.text}:{
                                // borderWidth: 1,
                                // borderColor: SchemeColor.text,
                            }
                        ]}
                        onPress={() => setAddOrRemove(true)}>
                            <Text style={[styles.ModalTitle,{color:addOrRemoveLabel? SchemeColor.background : SchemeColor.title,}]}>Add</Text>
                        </Pressable>
                        <Pressable style={[{flex:2, borderRadius: 10, padding: 10,justifyContent:"center",alignItems:"center",},
                            !addOrRemoveLabel? 
                            {backgroundColor: SchemeColor.text}:{
                                // borderWidth: 1,
                                // borderColor: SchemeColor.text,
                            }
                        ]}
                        onPress={() => setAddOrRemove(false)}>
                            <Text style={[styles.ModalTitle,{color:!addOrRemoveLabel? SchemeColor.background : SchemeColor.title,}]}>Remove</Text>
                        </Pressable>
                        <Pressable onPress={() => setLabelModal(false)} style={{flex:1,
                            justifyItems: 'center',
                            alignItems: 'center',
                        }}>
                            <AntDesign name="closecircle" size={34} color={SchemeColor.title} />
                        </Pressable>
                    </View>
                    <View style={{flex:1, justifyItems:"center",alignItems:"center"}}>
                        {addOrRemoveLabel? (
                            <Text style={[styles.ModalTitle,{color:SchemeColor.title,fontSize:15}]}>Select Labels To Add</Text>
                        ):(
                            <Text style={[styles.ModalTitle,{color:SchemeColor.title,fontSize:15}]}>Select Labels To Remove</Text>
                        )}
                    </View>
                    <View style={{flex:5,
                        flexDirection:"row",flexWrap:"wrap",marginHorizontal:40, justifyContent:"center"}}>
                         {allLabels.map((label) => {
                            // console.log(label);
                            return(<CheckBoxLabel
                            key={label.id+"LabelBox"}
                            LabelName={label.name}
                            LabelID={label.id}
                            onToggle={(LabelID, isSelected) => handleToggleLabel(LabelID, isSelected)}
                            SchemeColor={SchemeColor}
                            />)
                         })}
                    </View>
                    <View style={{flex:1}}>
                        {addOrRemoveLabel? (
                            <Pressable style={({pressed}) => [{flex:1,borderColor:SchemeColor.text, borderRadius: 10,borderWidth:1, padding: 10,justifyContent:"center",alignItems:"center",
                                backgroundColor: pressed ? SchemeColor.text : SchemeColor.background}]}
                                onPress={() => AddLabels()}>
                                    {({pressed}) => (
                                        <Text style={{color: pressed ? SchemeColor.background : SchemeColor.text,fontSize:20,fontStyle:"italic"}}>ADD</Text>
                                    )}
                        </Pressable>
                        ):(
                            <Pressable style={({pressed}) => [{flex:1,borderColor:SchemeColor.text, borderRadius: 10,borderWidth:1, padding: 10,justifyContent:"center",alignItems:"center",
                                backgroundColor: pressed ? SchemeColor.text : SchemeColor.background}]}
                                onPress={() => RemoveLabels()}>
                                    {({pressed}) => (
                                        <Text style={{color: pressed ? SchemeColor.background : SchemeColor.text,fontSize:20,fontStyle:"italic"}}>REMOVE</Text>
                                    )}
                        </Pressable>
                        )}
                    </View>
            </Modal>
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        // padding: 10,
        // backgroundColor: SchemeColor.background,
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
        // color:SchemeColor.text,
        borderStyle: "solid",
        // borderColor: SchemeColor.title,
        borderWidth: 1,
        borderRadius: 5,
        // backgroundColor: SchemeColor.background+"a0",
    },
    Modal:{
        position: "absolute",
        flex:1,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    ModalTitle:{
        flex:3,
        marginLeft: 5,
        fontSize: 20,
        fontWeight: "bold",
        // color:SchemeColor.background,
    },
    PrincipalPage:{flex:1,alignItems: 'center', justifyContent: 'center',width: "100%",},
    Title:{flex:1,fontSize:30,fontWeight:"bold",
        // color:SchemeColor.title
    },
    Episodes:{flex:1,fontSize:20,fontWeight:"500",fontStyle:"italic",
        // color:SchemeColor.title
    },
    // Synopsis:
};