import {Slot} from "expo-router";
import {View, Text, FlatList} from "react-native";
import Footer from "../components/Footer";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function Layout({children}) {

    const insets = useSafeAreaInsets();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: "black"}}>
        <StatusBar style="light" />
        <SafeAreaProvider>
            <Slot />
            <Footer/>
        </SafeAreaProvider>
    </View>
  );
}