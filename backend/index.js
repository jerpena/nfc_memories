import CONFIG from './config/backend.js';
import { Low, JSONFile } from 'lowdb';
import kodi from 'kodi-ws';
import { PN532 } from 'pn532';
import { SerialPort } from 'serialport';


const main = async () => {
    try {
        // Connect to KODI instance
        const conn = await kodi(CONFIG.KODI_IP, CONFIG.KODI_PORT);
        const picSource = await getPictureSourceFromKodi(conn);
        // console.log(picSource);
        const albumList = await getPictureSourceChildren(conn, picSource);
        // console.log(albumList);

    } catch (error) {
        console.error(error);
    }
};

const getPictureSourceFromKodi = async conn => {
    try {
        const album = await conn.Files.GetSources('pictures');
        // Get source that contains the label defined in config
        const source = album.sources.find(src =>
            src.label.includes(CONFIG.PICTURES_SRC_LABEL)
        );
        return source.file;
    } catch (error) {
        console.error(error);
    }
};

const getPictureSourceChildren = async (conn, picSource) => {
    try {
        const response = await conn.Files.GetDirectory(picSource);
        const directories = response.files;
        return directories;
    } catch (error) {
        console.error(error);
    }
};

const filterAlbums = albums => {
    return albums.filter(album => album.filetype === 'directory');
};

const formatAlbums = albums => {
    return albums.map(album => ({ src: album.file, id: '' }));
};

const getAlbumsFromDatabase = async () => {
    try {
        const adapter = new JSONFile(CONFIG.DB_PATH);
        const db = new Low(adapter);
        await db.read();
        return db.data;
    } catch (error) {
        console.error(error);
    }
};

const writeAlbumsToDatabase = async albums => {
    try {
        const adapter = new JSONFile(CONFIG.DB_PATH);
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

const waitForTag = () => {
    const serialPort = new SerialPort({
        path: CONFIG.NFC_PATH,
        baudRate: CONFIG.NFC_BAUD
    });
    const nfc = new PN532(serialPort);

    nfc.on('ready', () => {
        console.log('Waiting for tag.');
        nfc.on('tag', tag => {
            console.log(tag.uid);
        });
    });
};

main().catch(e => {
    if (e.stack) return console.error(e.stack);
    console.error(e);
}).then(() => {
    process.exit();
});