import {View, Text, Pressable} from "react-native";
import {Link} from "expo-router";
import {Feather} from "@expo/vector-icons";

export default function Footer(){
    return (
        <View style={{flexDirection: "row", width: "100%", backgroundColor: "yellow", paddingTop:10, paddingBottom:10}}>
            {/*<Link href="/" style={{flex:1}}><Text>Home</Text></Link>*/}
            {/*<Link href="/search" style={{flex:1}}><Text>Search</Text></Link>*/}
            {/*<Link href="/config" style={{flex:1}}><Text>Config</Text></Link>*/}
            <Link asChild href="/home" style={{flex:1}}>
                <Pressable style={{justifyContent: "center", alignItems: "center"}}>
                    <Feather name="home" size={24} color="black"/>
                </Pressable>
            </Link>
            <Link asChild href="/search" style={{flex:1}}>
                <Pressable style={{justifyContent: "center", alignItems: "center"}}>
                    <Feather name="search" size={24} color="black" />

                </Pressable>
            </Link>
            <Link asChild href="/config" style={{flex:1}}>
                <Pressable style={{justifyContent: "center", alignItems: "center"}}>
                    <Feather name="settings" size={24} color="black" />
                </Pressable>
            </Link>
        </View>
    );
}