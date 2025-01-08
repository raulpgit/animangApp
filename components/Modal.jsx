import {Animated, View} from "react-native";
import {useEffect, useRef} from "react";

export function Modal({children, visible,SchemeColor, width, height}) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [opacity,visible]);

    return (
            <Animated.View style={[styles.ModalBackgroud,{display: visible ? "flex" : "none",},{backgroundColor: opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)"]  // 0 : 150, 0.5 : 75, 1 : 0
                    }),}]}>
                <Animated.View style={[styles.ModalContainer,{backgroundColor: SchemeColor.background, width: width, height: height},{opacity,
                    transform: [{
                        translateY: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [15, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                        }),}]}]}>
                    {children}
                </Animated.View>
            </Animated.View>
    );
}
const styles = {
    ModalBackgroud:{
        position: "absolute",
        flex:1,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        alignItems: "center",
        justifyContent: "center",
    },
    ModalContainer:{
        // width: "90%",
        // height: "45%",
        borderRadius: 10,
        padding: 10,
        flexDirection:"column"
    },
}