import {View, Text} from "react-native";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import {db} from "../../lib/DBManager";

export default function Config(){

    useDrizzleStudio(db)
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Conf :)</Text>
        </View>
    );
}