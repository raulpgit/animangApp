import {View, FlatList, Pressable, Text, TextInput} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {CreateLabel, createTable, getAnimesofLabel, getAnimesSaved, getLabels,AddorWatchEpisode} from "../../lib/DBManager";
import AnimeSavedCard from "../../components/AnimeSavedCard";
import {Tabs, useFocusEffect} from "expo-router";
import {blue, defaultColor, getSelectedTheme} from "../../lib/Schemes";
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Colors } from "../../lib/labelColors";
import {Modal} from "../../components/Modal";
// import { SchemeColor } from "../_layout";




export default function Home(){
    const [animes, setAnimes] = useState([]);
    const [enableReviewModal, setReviewModal] = useState(false);
    const [enableLabelModal, setLabelModal] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [animeSelected, setAnime] = useState('');
    const [labels, setLabels] = useState([]);
    const [labelName, setLabelName] = useState('');
    const [labelColor, setLabelColor] = useState('');
    const [SchemeColor,setSchemeColor] = useState(defaultColor());


    const handleSliderValue = useCallback((value) => {setSliderValue(value)},[]);


    useFocusEffect(
        React.useCallback(() => {
            getSelectedTheme().then((value) =>setSchemeColor(value));
            getAnimesSaved().then((animes) => setAnimes(animes));
            setReviewModal(false);
            setLabelModal(false);
        }, [])
    );
    useEffect(() => {
        if(!enableLabelModal)setLabelName('');
        if(!enableLabelModal)setLabelColor('');
        if(!enableReviewModal)setReviewText('');
        // if(!enableReviewModal)setAnime('');
    });
    useFocusEffect(
        React.useCallback(() => {
            getLabels().then((labels) => setLabels(labels));
        }, [labels])
    );

    //---------------------------------DB THINGS---------------------------------
    if(animes.length === 0 && labels.length === 0 && (!enableReviewModal || !enableLabelModal)) createTable();
    //---------------------------------------------------------------------------

    return (
        <View style={[styles.container,{backgroundColor: SchemeColor.background,}]}>
            {/* <Tabs.Screen
                options={{
                    tabBarInactiveTintColor: SchemeColor.title,
                    tabBarInactiveBackgroundColor: SchemeColor.background,
                    tabBarActiveTintColor: SchemeColor.background ,
                    tabBarActiveBackgroundColor: SchemeColor.title,
                }}
            /> */}
            <View style={{flex:1, width:"100%", flexDirection: "row", justifyContent:"center", alignItems:"center"}}>
                <FlatList data={labels} style={[styles.flatlist]} horizontal={true} keyExtractor={label => label.id}
                          renderItem={({ item }) => (
                            <Pressable onPress={() => getAnimesofLabel(item.id).then((animes) => setAnimes(animes))}>
                                <Text key={item.id} style={[styles.Label,{backgroundColor: item.color+"99",padding:10,color:SchemeColor.text,borderColor: SchemeColor.title,}]}>{item.name}</Text>
                            </Pressable>
                          )}
                          ListFooterComponent={<Pressable style={[styles.Label,{padding:5,color:SchemeColor.text,borderColor: SchemeColor.title,}]} onPress={() => setLabelModal(true)}>
                          <Ionicons name="add-circle" size={30} color={SchemeColor.text} />
                      </Pressable>}/>
                
            </View>
            <View style={{flex:15, width:"100%"}}>
                <FlatList data={animes} style={[styles.flatlist,{flex:6}]} numColumns={1} keyExtractor={anime => anime.mal_id}
                          renderItem={({ item }) => (<AnimeSavedCard key={item.mal_id} anime={item} onModal={() => (setAnime(item),setReviewModal(true))} SchemeColor={SchemeColor}/>)}/>
            </View>
            {/*---------------------------REVIEW MODAL-------------------------------------*/}
            <Modal SchemeColor={SchemeColor} visible={enableReviewModal} width="90%" height={animeSelected.episodes === animeSelected.last_watched ? "20%" : "60%"}>
                    <View style={{flex:1,flexDirection:"row",backgroundColor: animeSelected.episodes === animeSelected.last_watched ? SchemeColor.background : SchemeColor.text, margin:10,
                        justifyItems: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        justifyContent: 'space-between',
                    }}>
                        {animeSelected.last_watched ===  animeSelected.episodes ? 
                        (<Text style={{flex:3}}></Text>) : 
                        (<Text style={[styles.ModalTitle,{color:SchemeColor.background,}]}>{animeSelected.title} Episode {animeSelected.last_watched+1}</Text>)}
                        <Pressable onPress={() => setReviewModal(false)} style={{flex:1,
                            justifyItems: 'center',
                            alignItems: 'center',
                        }}>
                            <AntDesign name="closecircle" size={34} color={animeSelected.episodes === animeSelected.last_watched ? SchemeColor.text : SchemeColor.background} />
                        </Pressable>
                    </View>
                    {animeSelected.episodes === animeSelected.last_watched ? 
                    (
                        <View style={{flex:1, margin:10,flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                            <Text style={[styles.ModalTitle,{color:SchemeColor.text}]}>Anime Finished</Text>
                        </View>
                    ) : (
                        <View style={{flex:5, margin:10,flexDirection:"column"}}>
                        <View style={{flex:1, flexDirection:"row",justifyContent:"space-between", alignItems:"center"}}>
                            {sliderValue > 0 ? (
                                sliderValue > 1 ? (
                                        <FontAwesome name="star" size={50} color={SchemeColor.text} />
                                    ) :
                                    (
                                        <FontAwesome name="star-half-o" size={50} color={SchemeColor.text} />
                                    )
                            ) : (
                                <FontAwesome name="star-o" size={50} color={SchemeColor.text} />
                            )
                            }
                            {sliderValue > 2 ? (
                                sliderValue > 3 ? (
                                        <FontAwesome name="star" size={50} color={SchemeColor.text} />
                                    ) :
                                    (
                                        <FontAwesome name="star-half-o" size={50} color={SchemeColor.text} />
                                    )
                            ) : (
                                <FontAwesome name="star-o" size={50} color={SchemeColor.text} />
                            )
                            }
                            {sliderValue > 4 ? (
                                sliderValue > 5 ? (
                                        <FontAwesome name="star" size={50} color={SchemeColor.text} />
                                    ) :
                                    (
                                        <FontAwesome name="star-half-o" size={50} color={SchemeColor.text} />
                                    )
                            ) : (
                                <FontAwesome name="star-o" size={50} color={SchemeColor.text} />
                            )
                            }
                            {sliderValue > 6 ? (
                                sliderValue > 7 ? (
                                        <FontAwesome name="star" size={50} color={SchemeColor.text} />
                                    ) :
                                    (
                                        <FontAwesome name="star-half-o" size={50} color={SchemeColor.text} />
                                    )
                            ) : (
                                <FontAwesome name="star-o" size={50} color={SchemeColor.text} />
                            )
                            }
                            {sliderValue > 8 ? (
                                sliderValue > 9 ? (
                                        <FontAwesome name="star" size={50} color={SchemeColor.text} />
                                    ) :
                                    (
                                        <FontAwesome name="star-half-o" size={50} color={SchemeColor.text} />
                                    )
                            ) : (
                                <FontAwesome name="star-o" size={50} color={SchemeColor.text} />
                            )
                            }
                        </View>
                        <Slider
                            style={{ flex:1,width: "96%",alignSelf:"center" }} // Set the desired width here
                            minimumValue={0}
                            maximumValue={10}
                            step={1}
                            onValueChange={handleSliderValue}
                            value={sliderValue}
                            thumbTintColor={SchemeColor.text}
                            minimumTrackTintColor={SchemeColor.text}
                            maximumTrackTintColor={SchemeColor.icons}
                        />
                        <View style={{flex:3}}>
                            <TextInput
                                style={{ flex:1,backgroundColor: SchemeColor.text, borderRadius: 10, padding: 10,textAlignVertical: "top", color: SchemeColor.background}}
                                onChangeText={(value) => setReviewText(value)}
                                value={reviewText}
                                placeholder="Set your review here"
                                keyboardType="default"
                                multiline={true}
                            />
                        </View>
                        <View style={{flex:1, margin:10}}>
                            <Pressable style={({pressed}) => [{flex:1,borderColor:SchemeColor.text, borderRadius: 10,borderWidth:1, padding: 10,justifyContent:"center",alignItems:"center",
                            backgroundColor: pressed ? SchemeColor.text : SchemeColor.background}]}
                            onPress={() => {
                                AddorWatchEpisode(animeSelected.mal_id,animeSelected.last_watched+1,reviewText,sliderValue,true);
                                setReviewModal(false);
                            }}>
                                {({pressed}) => (
                                    <Text style={{color: pressed ? SchemeColor.background : SchemeColor.text,fontSize:20,fontStyle:"italic"}}>Save</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                    )}
            </Modal>
            {/*---------------------------LABEL MODAL-------------------------------------*/}
            <Modal SchemeColor={SchemeColor} visible={enableLabelModal} width="90%" height="45%">
                    <View style={{flex:1,flexDirection:"row", margin:10,
                        justifyItems: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        justifyContent: 'space-between',
                    }}>
                        <TextInput style={[styles.ModalTitle,{color:SchemeColor.title,}]}
                        onChangeText={(value) => setLabelName(value)}
                        value={labelName}
                        placeholder="Set Label Name..."
                        placeholderTextColor={SchemeColor.text+"a0"}
                        keyboardType="default"
                        />
                        <Pressable onPress={() => setLabelModal(false)} style={{flex:1,
                            justifyItems: 'center',
                            alignItems: 'center',
                        }}>
                            <AntDesign name="closecircle" size={34} color={SchemeColor.title} />
                        </Pressable>
                    </View>
                    <View style={{flex:1, backgroundColor: SchemeColor.background, justifyItems:"center",alignItems:"center"}}>
                        <Text style={[styles.ModalTitle,{color:SchemeColor.title,fontSize:15}]}>Select Color</Text>
                    </View>
                    <View style={{flex:2,
                        flexDirection:"row",flexWrap:"wrap",marginHorizontal:40, justifyContent:"center"}}>
                        {Colors.map((color) => (
                            // console.log(color),
                            <Pressable key={color.colorName}
                            style={({pressed}) => [styles.LabelColor, {backgroundColor:color.colorCode, padding: pressed? 1: 0}, labelColor === color.colorCode ? {borderWidth:2, borderColor: SchemeColor.text}:{}]}
                            onPress={() => setLabelColor(color.colorCode)}
                            />
                        ))} 
                    </View>
                    <View style={{flex:1}}>
                        <Pressable style={({pressed}) => [{flex:1,borderColor:SchemeColor.text, borderRadius: 10,borderWidth:1, padding: 10,justifyContent:"center",alignItems:"center",
                                backgroundColor: pressed ? SchemeColor.text : SchemeColor.background}]}
                                onPress={() => {if(CreateLabel(labelName,labelColor))setLabelModal(false)}}>
                                    {({pressed}) => (
                                        <Text style={{color: pressed ? SchemeColor.background : SchemeColor.text,fontSize:20,fontStyle:"italic"}}>Create</Text>
                                    )}
                        </Pressable>
                    </View>
            </Modal>
        </View>
    );
}
const styles = {
    container: {
        flex: 1,
        flexDirection: "column",
        
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlist:{
        // flexDirection: "row",
        // flex:1,
        // flexWrap: "wrap",
        width: "100%",
        height: "100%",
        // justifyContent: "center",
        // alignItems: "center"
    },
    ModalTitle:{
        flex:3,
        marginLeft: 5,
        fontSize: 20,
        fontWeight: "bold",
        
    },
    Label:{
        flex:1,
        // padding:10,
        margin:5,
        fontSize:15,
        fontWeight:"100",
        // color:SchemeColor.text,
        borderStyle: "solid",
        // borderColor: SchemeColor.title,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent:"center",
        alignItems:"center"
    },
    LabelColor:{
        margin:10,
        // flex:1,
        width: 30,
        height: 30,
        borderRadius:30
    }
}
