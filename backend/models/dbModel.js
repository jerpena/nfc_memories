import db from '../config/connectDB.js';
import logger from '../lib/logger.js';
import { replaceSpacesWithChar } from '../lib/util.js';

const albumDB = db.data.albums;

const formatKey = str => {
    // format obj key
    return replaceSpacesWithChar(str).toLowerCase();
};

const getAlbumByLabel = label => {
    // spread albumDB key into new obj and return album obj
    const obj = {
        ...albumDB[label]
    };
    return {
        [label]: obj
    };
};

const getAlbumById = id => {
    // convert db to array and return album if found
    const albums = Object.entries(albumDB);
    return albums.find(album => album[1].id === id);
};

const getAlbumDifference = (db1, db2) => {
    const albums = [];

    for (const key in db2) {
        const value = db2[key];
        // checking if key from db2 is in db1
        if (!db1[key]) {
            albums.push({
                [key]: value
            });
        }
    }
    return albums;
};

const addAlbum = album => {
    // getting key name and value from album
    const [key, value] = Object.entries(album)[0];
    albumDB[key] = value;
    // format required to log objects to console
    logger.debug(`\nkey: ${key} \nvalue: %o`, value);
};

const deleteAlbum = album => {
    // convert to array because album key is unknown
    const key = Object.keys(album)[0];
    delete albumDB[key];
    logger.debug(`Album ${key} removed from db`);
};

const updateDB = async albums => {
    /* kodi response has both files and directories and
    we only want the directories */
    const getDirectories = () =>
        albums.filter(album => album.filetype === 'directory');
    // removing unwanted keys from our album directories
    const setSchema = dirs => Object.fromEntries(
        dirs.map(album =>
            [
                formatKey(album.label),
                {
                    id: '',
                    src: album.file,
                    label: album.label
                }
            ]
        )
    );

    const directories = getDirectories(),
        kodiAlbums = setSchema(directories),
        addedAlbums = getAlbumDifference(albumDB, kodiAlbums),
        deletedAlbums = getAlbumDifference(kodiAlbums, albumDB);
    // when new albums are created in kodi, add it to local db
    for (const album of addedAlbums) {
        addAlbum(album);
    }
    // when album is removed in kodi, delete it from local db
    for (const album of deletedAlbums) {
        deleteAlbum(album);
    }

    await writeDB();
};

const writeDB = async () => await db.write();
const getDB = async () => await db.read();

export {
    updateDB,
    getDB,
    writeDB,
    addAlbum,
    getAlbumByLabel,
    getAlbumById
};