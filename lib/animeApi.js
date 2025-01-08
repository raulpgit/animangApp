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
//TODO -->
export async function getEpisodes(id,pagination){
    const Anime = "https://api.jikan.moe/v4/anime/";
    const rawData = await fetch(Anime+id+"/episodes?page="+pagination); // For debugging
    const json = await rawData.json();
    const { data } = json;
    // console.log(data);
    return data.map((entry) => {
        const {mal_id,title, title_japanese, title_romanji} = entry;
        // console.log("Loaded episode: "+mal_id+": "+title);
        return {mal_id,title, title_japanese, title_romanji};
    });

}
export async function hasMorePages(id,page){
    const Anime = "https://api.jikan.moe/v4/anime/";
    const rawData = await fetch(Anime+id+"/episodes"); // For debugging
    const json = await rawData.json();
    const { pagination } = json;
    const {last_visible_page,has_next_page} = pagination;
    console.log(last_visible_page+" || "+page);
    if(last_visible_page >= page && has_next_page)return true;
    else return false;
}
export async function getMorePages(id,page){
    const Anime = "https://api.jikan.moe/v4/anime/";
    const rawData = await fetch(Anime+id+"/episodes"); // For debugging
    const json = await rawData.json();
    const { pagination } = json;
    const {last_visible_page,has_next_page} = pagination;
    console.log(last_visible_page+" || "+page);
    return {last_visible_page};
}
export async function getAnimeSearch(query) {
    const Search = "https://api.jikan.moe/v4/anime";
    const rawData = await fetch(Search+"?q="+query); //+"&page="+num //For future reference to add pagination
    console.log(Search+"?q="+query);
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