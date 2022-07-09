import CONFIG from './config.js';
import { Low, JSONFile } from 'lowdb';
import kodi from "kodi-ws";
import { PN532 } from "pn532";
import { SerialPort } from "serialport";
import { fileURLToPath } from 'node:url';

const main = async () => {
    // Connect to KODI instance
    const conn = await kodi(CONFIG.KODI_IP, CONFIG.KODI_PORT);
    const picSource = await getPictureSource(conn);
    // console.log(picSource);
    const albumList = await getDirectoriesInSource(conn, picSource);
    // console.log(albumList);
};

const getPictureSource = async conn => {
    const album = await conn.Files.GetSources("pictures");
    // Get source that contains the label defined in config
    const source = album.sources.find(src =>
        src.label.includes(CONFIG.PICTURES_SRC_LABEL)
    );
    return source.file;
};

const getDirectoriesInSource = async (conn, picSource) => {
    const response = await conn.Files.GetDirectory(picSource);
    const directories = response.files;
    return directories;
};

const filterAlbums = albums => {
    return albums.filter(album => album.filetype === 'directory');
};

const formatAlbums = albums => {
    return albums.map(album => ({ src: album.file, nfc: '' }));
};

const getAlbumsFromDatabase = async () => {
    try {
        const dbPath = fileURLToPath(new URL(CONFIG.DATABASE, import.meta.url));
        const adapter = new JSONFile(dbPath);
        const db = new Low(adapter);
        await db.read();
        return db.data;
    } catch (error) {
        console.error(error);
    }
};

const writeAlbumsToDatabase = async albums => {
    try {
        const dbPath = fileURLToPath(new URL(CONFIG.DATABASE, import.meta.url));
        const adapter = new JSONFile(dbPath);
        const db = new Low(adapter);
        db.data = albums;
        await db.write();
    } catch (error) {
        console.error(error);
    }
};

const searchForAlbum = (name, albums) => {
    return albums.find(album => album.src === name);
};

const searchForTag = (id, albums) => {
    return albums.find(album => album.id === id);
};

main().catch(e => {
    if (e.stack) return console.error(e.stack);
    console.error(e);
}).then(() => {
    process.exit();
});