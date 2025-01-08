import AsyncStorage from '@react-native-async-storage/async-storage';


let background, title, text, icons = "white";
export function blue(){
    background= "#0C2340";
    title= "#ADD8E6";
    text= "#AFDBF5";
    icons= "#3E8EDE";
    return {background, title, text, icons};
}

export function defaultColor(){
    background= "#161a1d";
    title= "#b1a7a6";
    text= "#f5f3f4";
    icons= "#d3d3d3";
    return {background, title, text, icons};
}

export const handleSelectSave = async (colorName) => {
    await saveSelectedTheme(colorName); // Guarda en AsyncStorage
    // setSelectedScheme(colorName);
    // console.log(`Theme ${colorName} selected and saved.`);
};


export function setSelectedScheme(colorName){
    // console.log("Value to select is: "+colorName);
    if(colorName === "blue"){
        console.log("selected theme is Blue")
        return blue();
    }
    // else if(colorName === "red"){

    // }
    else{
        console.log("selected theme is DEFAULT")
        return defaultColor();
    }
}
export async function getSelectedTheme(){
    try {
        const value = await  AsyncStorage.getItem('SchemeColor');
    //   if (value !== null) {
        // console.log("value : "+value);
        const color = setSelectedScheme(value);
        // console.log(color);
        return (color);
    //   }
    } catch (e) {
        // error reading value  
    }
}
export async function saveSelectedTheme(color){
    try {
        await AsyncStorage.setItem('SchemeColor', color);
    } catch (e) {
        // saving error
    }
}

