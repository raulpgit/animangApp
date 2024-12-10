import {Slot, Stack} from "expo-router";
import {View} from "react-native";
import Footer from "../components/Footer";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useSafeAreaInsets} from "react-native-safe-area-context";


export default function StackLayout() {

    const insets = useSafeAreaInsets();
    // const db =  SQLite.openDatabaseSync('AniManga');
    // setDB("AniManga");

  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
        <StatusBar style="light" />
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                }}/>
            </Stack>
            {/*<Footer/>*/}
        </SafeAreaProvider>
    </View>
  );
}