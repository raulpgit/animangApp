import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('animanga.db');

export async function DropTables(){
    const db = SQLite.openDatabaseSync('animanga.db');
    //-------------------DROP TABLES-------------------
    db.execAsync(`
    DROP TABLE animes;
    DROP TABLE animeViews;
    DROP TABLE labels;
    DROP TABLE animeLabels;
    `);
    //-------------------------------------------------
}

export async function createTable() {
    // SQLite.deleteDatabaseSync('animanga.db');
    const db = SQLite.openDatabaseSync('animanga.db');
    // console.log("Trying locate db");

    //------------------CREATE TABLES------------------
    db.execAsync(`
    CREATE TABLE IF NOT EXISTS animes (
        mal_id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        image TEXT NOT NULL,
        synopsis TEXT,
        episodes INTEGER,
        last_watched INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS animeViews (
        animeID INTEGER NOT NULL,
        episode TEXT NOT NULL,
        review TEXT,
        rating FLOAT,
        watched BOOLEAN,
        Date DATE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS labels (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS animeLabels (
        animeID INTEGER NOT NULL,
        labelID INTEGER NOT NULL,
        CONSTRAINT PK_animeLabels PRIMARY KEY (animeID, labelID)
    );
    `);
    const result = await db.getAllAsync('SELECT * FROM labels');
    if(result.length === 0) {
        console.log("No labels saved");
        await db.runAsync(`INSERT INTO labels (id,name, color) VALUES
            (2,'Not Started', '#E62020'),
            (3,'OnGoing', '#E6E620'),
            (4,'Finished', '#20E620'),
            (1,'All', '#432818');`
        );
    }
    else
        console.log("Labels saved: "+result.length);
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
    const last_episode = await GetLastWatchedbyId(id);
    console.log("Trying to save anime: "+ title+" with episodes: "+episodes+" and last watched: "+last_episode);
    await db.runAsync('INSERT INTO animes (mal_id, title, image,synopsis,episodes,last_watched) VALUES (?, ?, ?, ?, ?,?)', [ id,title,image,synopsis,episodes,last_episode]);

    
    const notStarted = await db.getAllAsync('SELECT * FROM labels WHERE name = ?', ["Not Started"]);
    const ongoing = await db.getAllAsync('SELECT * FROM labels WHERE name = ?', ["OnGoing"]);
    const finished = await db.getAllAsync('SELECT * FROM labels WHERE name = ?', ["Finished"]);
    console.log(notStarted[0]);
    const thisAnimeHasLabels = await db.getAllAsync(`
        SELECT COUNT(*) as count FROM animeLabels 
        WHERE animeID = ? 
        AND (labelID = ? OR labelID = ? OR labelID = ?)`,[id,notStarted[0].id,ongoing[0].id,finished[0].id]);
    // console.log("this anime has "+thisAnimeHasLabels[0].count+" labels");
    if(thisAnimeHasLabels[0].count === 0){
        console.log("adding label not started")
        await db.runAsync('INSERT INTO animeLabels (animeID, labelID) VALUES (?, ?)', [ id,notStarted[0].id]);
    }

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
    // await db.runAsync('DELETE from animeLabels WHERE animeID = ?', [id]);
    if(await !getAnimeSaved(id)) console.log("Anime removed successfully");
    else
        console.log("Error removing anime");
}

export async function getAnimesSaved() {
    const db = SQLite.openDatabaseSync('animanga.db');
    console.log("Trying to get animes saved");
    // const result = await db.getAllAsync('SELECT mal_id,title,image,synopsis,episodes,last_watched FROM animes');
    const result = await db.getAllAsync('SELECT * FROM animes');
    // for (const row of result) {
    //     console.log(row.mal_id, row.title, row.image);
    // }
    console.log("Animes saved: "+result.length);
    if(result.length === 0) console.log("No animes saved");
    return (result);
}
export async function getAnimeSaved(id) {
    const result = await db.getAllAsync('SELECT mal_id,title,image FROM animes WHERE mal_id = ?', [id]);
    console.log("Anime saved: "+(result.length !== 0));
    return (result.length !== 0);

}
export async function getEpisodeSaved(animeid, episode) {
    const result = await db.getAllAsync('SELECT * FROM animeViews WHERE animeID = ? AND episode = ?', [animeid,episode]);
    // console.log("Anime saved: "+(result.length !== 0));
    return (result);
}
export async function AddorWatchEpisode(animeid, episode, review, rating, watched) {
    const db = await SQLite.openDatabaseAsync("animanga.db");
    console.log("-------ADDING EPISODE-------");
    if((await getEpisodeSaved(animeid, episode)).length !== 0) {
        console.log("Episode already saved, set as watched");
        await db.runAsync('UPDATE animeViews SET watched = ? WHERE animeID = ? AND episode = ?', [watched, animeid, episode]);
        return;
    }
    console.log("Trying to save episode: "+ episode);
    await db.runAsync('INSERT INTO animeViews (animeID, episode, review, rating, watched) VALUES (?, ?, ?, ?, ?)', [ animeid, episode, review, rating, watched]);
    await db.runAsync('UPDATE animes SET last_watched = ? WHERE mal_id = ?', [episode, animeid]);
    if(await getEpisodeSaved(animeid, episode)) console.log("Episode saved successfully");
    //-----------------------Setting Label-----------------------
    const anime = await db.getAllAsync('SELECT * FROM animes WHERE mal_id = ?', [animeid]);
    if(anime[0].last_watched > 0) {
        const notStarted = await db.getAllAsync('SELECT * FROM labels WHERE name = ?', ["Not Started"]);
        await db.runAsync('DELETE FROM animeLabels WHERE animeID = ? AND labelID = ?', [animeid, notStarted[0].id]);
        const onGoing = await db.getAllAsync('SELECT * FROM labels WHERE name = ?', ["OnGoing"]);
        if(anime[0].last_watched < anime[0].episodes) {
            await db.runAsync('INSERT INTO animeLabels (animeID, labelID) VALUES (?, ?)', [ animeid, onGoing[0].id]);
        }
        else{
            await db.runAsync('DELETE FROM animeLabels WHERE animeID = ? AND labelID = ?', [animeid, onGoing[0].id]);
            const finished = await db.getAllAsync('SELECT * FROM labels WHERE name = ?', ["Finished"]);
            await db.runAsync('INSERT INTO animeLabels (animeID, labelID) VALUES (?, ?)', [ animeid, finished[0].id]);
        }
    }
    else
        console.log("Error saving episode");
}
export async  function UnWatchEpisode(animeid,episode){
    const db = await SQLite.openDatabaseAsync("animanga.db");
    console.log("-------UNWATCHING EPISODE-------");
    console.log("Trying to unwatch episode: "+episode);
    await db.runAsync('UPDATE animeViews SET watched = ? WHERE animeID = ? AND episode = ?', [false, animeid, episode]);
    if(await !getEpisodeSaved(animeid, episode)) console.log("Episode unwatched successfully");
    else
        console.log("Error unwatching episode");

    //-----------------------Setting Label-----------------------

}
export async function RemoveEpisode(animeid, episode) {
    const db = await SQLite.openDatabaseAsync("animanga.db");
    console.log("-------REMOVING EPISODE-------");
    if(await !getEpisodeSaved(animeid, episode)) {
        console.log("Episode already removed or not saved");
        return;
    }
    console.log("Trying to remove episode: "+episode);
    await db.runAsync('DELETE from animeViews WHERE animeID = ? AND episode = ?', [animeid, episode]);
    if(await !getEpisodeSaved(animeid, episode)) console.log("Episode removed successfully");
    else
        console.log("Error removing episode");
}
export async function getLabelsOfAnime(id) {
    const db = SQLite.openDatabaseSync('animanga.db');
    console.log("Trying to get labels of anime: "+id);
    //TODO --> Cambiar la query para que no entre en la tabla de animes, directamente coga la id en animeLabels (para poder poner labels a animes no guardados)
    const result = await db.getAllAsync('SELECT * FROM labels l JOIN animeLabels al ON l.id = al.labelID JOIN animes a ON al.animeID = a.mal_id WHERE a.mal_id = ?;', [id]);
    console.log("Labels of anime: "+result.length);
    return (result);
}
export async function getLabels() {
    const db = SQLite.openDatabaseSync('animanga.db');
    // console.log("Trying to get labels");
    const result = await db.getAllAsync('SELECT * FROM labels');
    // console.log("Labels: "+result.length);
    return (result);
}
export async function getAnimesofLabel(id) {
    const db = SQLite.openDatabaseSync('animanga.db');
    // console.log("Trying to get animes of label: "+id);
    const isAllLabel = await db.getAllAsync('Select * from labels where id = ?',[id]);
    let query = "";
    if(isAllLabel[0].name === 'All') query = "SELECT * FROM animes";
    else query = 'SELECT * FROM animes a JOIN animeLabels al ON a.mal_id = al.animeID JOIN labels l ON al.labelID = l.id WHERE l.id = ?;'
    const result = await db.getAllAsync(query, [id]);
    // console.log("Animes of label: "+result.length);
    return (result);
}
export async function CreateLabel(Name,ColorCode){
    const db = SQLite.openDatabaseSync('animanga.db');
    await db.getAllAsync('INSERT INTO labels (name, color) VALUES(?, ?)', [Name,ColorCode]);
    if((await GetLabelbyName(Name)).length > 0){
        console.log("Label Created Succesfully");
        return true;
    }
    else return false;
}
export async function GetLabelbyName(Name){
    const db = SQLite.openDatabaseSync('animanga.db');
    const result = await db.getAllAsync('SELECT * FROM labels where name = ?', [Name]);
    return result;
}
export async function GetLabelsToSelect(){
    const db = SQLite.openDatabaseSync('animanga.db');
    //All the labels that I don't want to be select they gonna be discarted from this selection;
    let query = "SELECT * FROM labels WHERE ";

    const discardNames = ["Not Started", "OnGoing", "Finished","All"]

    for(let i = 0; i < discardNames.length; i++){
        query += " name NOT LIKE '"+discardNames[i]+"'";
        if(i+1 < discardNames.length) query += " AND "
    }
    // console.log(query);
    const result = db.getAllAsync(query)
    return result;
}
export async function GetLabelsofAnimeToSelect(id, addORRemove){
    const db = SQLite.openDatabaseSync('animanga.db');
    //All the labels that I don't want to be select they gonna be discarted from this selection;
    let query = "SELECT ";
    if(addORRemove){ //LABELS TO ADD TO AN ANIME
        query += "DISTINCT l.* FROM labels l LEFT JOIN animeLabels al ON l.id = al.labelID AND al.animeID = ? WHERE al.animeID IS NULL AND ";
    }
    else{ // LABELS TO REMOVE FROM AN ANIME
        query+= "l.* FROM labels l JOIN animelabels al on l.id = al.labelID WHERE al.animeID = "+id+" AND ";
    }

    const discardNames = ["Not Started", "OnGoing", "Finished","All"]

    for(let i = 0; i < discardNames.length; i++){
        query += " name NOT LIKE '"+discardNames[i]+"'";
        if(i+1 < discardNames.length) query += " AND "
    }
    // console.log(query);
    const result = db.getAllAsync(query,[id])
    return result;
}
export async function AddLabelToAnime(animeID,labelID){
    const db = SQLite.openDatabaseSync('animanga.db');
    // console.log("adding label : "+labelID+" to anime: "+animeID);
    const itExist = await db.getAllAsync("SELECT * FROM animeLabels where animeID = ? AND labelID = ?",[animeID,labelID])
    if(itExist.length > 0){
        console.log("Label already added");
        return;
    }
    await db.runAsync('INSERT INTO animeLabels (animeID, labelID) VALUES (?, ?)', [ animeID,labelID]);
    // console.log("Trying to search another time the query");
    const itExistNow = await db.getAllAsync("SELECT * FROM animeLabels where animeID = ? AND labelID = ?",[animeID,labelID])
    if(itExistNow.length > 0)console.log("Label Added Into Anime");

}
export async function RemoveLabelToAnime(animeID,labelID){
    const db = SQLite.openDatabaseSync('animanga.db');
    console.log("removing label : "+labelID+" to anime: "+animeID);
    const itExist = await db.getAllAsync("SELECT * FROM animeLabels where animeID = ? AND labelID = ?",[animeID,labelID])
    // console.log(itExist.length);
    if(itExist.length < 1){
        console.log("Label already deleted");
        return;
    }
    await db.runAsync('DELETE FROM animeLabels WHERE animeID = ? AND labelID = ?', [ animeID,labelID]);
    // console.log("Trying to search another time the query");
    const itExistNow = await db.getAllAsync("SELECT * FROM animeLabels where animeID = ? AND labelID = ?",[animeID,labelID])
    if(itExistNow.length > 0)console.log("Label Removed from Anime");

}
export async function GetLastWatchedbyId(id){
    const db = SQLite.openDatabaseSync('animanga.db');
    const result = await db.getAllAsync('SELECT * FROM animeviews WHERE animeID = ? ORDER BY Date DESC LIMIT 1', [id]);
    if(result.length > 0)return result[0].episode;
    else return 0;
}

export async function debugSql(sqlEntry) {
    const db = SQLite.openDatabaseSync('animanga.db');
    console.log("Trying to debug sql: "+sqlEntry);
    const result = await db.getAllAsync(sqlEntry);
    console.log("Result:  ");
    result.map((entry) => {
        console.log("---------------------------------------------------")
        console.log(entry);
        console.log("---------------------------------------------------")
    });
    // return (result);
}
