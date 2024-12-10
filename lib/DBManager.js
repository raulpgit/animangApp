import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('animanga.db');

export async function createTable() {
    const db = SQLite.openDatabaseSync('animanga.db');
    console.log("Trying locate db");

    //-------------------DROP TABLES-------------------
    // db.execAsync(`
    // DROP TABLE animes;
    // DROP TABLE animeViews;
    // `);
    //-------------------------------------------------
    //------------------CREATE TABLES------------------
    db.execAsync(`
    CREATE TABLE IF NOT EXISTS animes (mal_id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, image TEXT NOT NULL,synopsis TEXT, episodes INTEGER, last_watched INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS animeViews (animeID INTEGER NOT NULL, episode TEXT NOT NULL, review TEXT, rating FLOAT);
    `);
    //-------------------------------------------------
    console.log("DB located");
}


export async function AddAnime(id,  title, image,synopsis,episodes) {
    const db = await SQLite.openDatabaseAsync("animanga.db");
    console.log("-------ADDING ANIME-------");
    if(await getAnimeSaved(id)) {
        console.log("Anime already saved");
        return;
    }
    console.log("Trying to save anime: "+ title+" with episodes: "+episodes);
    await db.runAsync('INSERT INTO animes (mal_id, title, image,synopsis,episodes) VALUES (?, ?, ?, ?, ?)', [ id,title,image,synopsis,episodes]);
    if(await getAnimeSaved(id)) console.log("Anime saved successfully");
    else
        console.log("Error saving anime");
}
export async function RemoveAnime(id) {
    const db = await SQLite.openDatabaseAsync("animanga.db");
    console.log("-------REMOVING ANIME-------");
    if(await !getAnimeSaved(id)) {
        console.log("Anime already removed or not saved");
        return;
    }
    console.log("Trying to remove anime: "+id);
    await db.runAsync('DELETE from animes WHERE mal_id = ?', [id]);
    if(await !getAnimeSaved(id)) console.log("Anime removed successfully");
    else
        console.log("Error removing anime");
}

export async function getAnimesSaved() {
    const db = SQLite.openDatabaseSync('animanga.db');
    console.log("Trying to get animes saved");
    const result = await db.getAllAsync('SELECT mal_id,title,image,synopsis,episodes,last_watched FROM animes');
    // for (const row of result) {
    //     console.log(row.mal_id, row.title, row.image);
    // }
    console.log("Animes saved: "+result.length);
    if(result.length === 0) console.log("No animes saved");
    return (result);
}
export async function getAnimeSaved(id) {
    const result = await db.getAllAsync('SELECT mal_id,title,image FROM animes WHERE mal_id = ?', [id]);
    // console.log("Anime saved: "+(result.length !== 0));
    return (result.length !== 0);

}
export async function getEpisodeSaved(animeid, episode) {
    const result = await db.getAllAsync('SELECT * FROM animeViews WHERE animeID = ? AND episode = ?', [animeid,episode]);
    // console.log("Anime saved: "+(result.length !== 0));
    return (result);

}