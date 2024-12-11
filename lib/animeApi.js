export async function getAnimeTop(num) {
    const Top = "https://api.jikan.moe/v4/top/anime";
    const rawData = await fetch(Top+"?limit=24"); //+"&page="+num //For future reference to add pagination
    const json = await rawData.json();
    const { data } = json;
    // console.log(data); // For debugging purposes
    return data.map((entry) => {
        const { title, mal_id, images } = entry;
        const { webp } = images;
        const { image_url } = webp;

        // console.log(title) // For debugging purposes

        return { title, mal_id, image: image_url };
    });
}
export async function getAnime(id){
    const Anime = "https://api.jikan.moe/v4/anime/";
    const rawData = await fetch(Anime+id); // For debugging
    const json = await rawData.json();
    const { data } = json;
    // console.log(data); // For debugging purposes
    const { title, synopsis, episodes, score, images, genres } = data;
    const { webp } = images;
    const { image_url } = webp;
    return { title, synopsis, image: image_url, episodes,genres }; //genres & more info for future things ||| Episodes count has to change in a future update
}