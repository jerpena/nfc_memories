import CONFIG from '../config/backend.js';
import kodi from '../config/connectKodi.js';

import {
    updateDB,
    addAlbum,
    getAlbumByLabel,
    writeDB
} from '../models/dbModel.js';

const getPictureSourceFromKodi = async () => {
    const album = await kodi.Files.GetSources('pictures');
    // Get source that contains the label defined in config
    const source = album.sources.find(src =>
        src.label.includes(CONFIG.PICTURES_SRC_LABEL)
    );
    if (!source) return;
    return source.file;
};

const getPictureSourceChildren = async picSource => {
    const response = await kodi.Files.GetDirectory(picSource);
    const children = response.files;
    return children;
};

// @desc    Update local db 
// @route   GET /db/update
// @access  Public
const updateLocalDatabase = async (req, res, next) => {
    try {
        const pictureSource = await getPictureSourceFromKodi();
        if (!pictureSource) {
            res.status(404);
            throw new Error(`Source: ${CONFIG.PICTURES_SRC_LABEL} not found in Kodi`);
        }

        const albums = await getPictureSourceChildren(pictureSource);
        if (!albums) {
            res.status(404);
            throw new Error(`No files found in ${CONFIG.PICTURES_SRC_LABEL}`);
        }
        await updateDB(albums);
        res.status(200).json({ message: 'Local database updated' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update album nfc id
// @route   PUT /db/album/:label
// @access  Public
const updateAlbum = async (req, res, next) => {
    try {
        if (!req.body.id) {
            res.status(400);
            throw new Error('Invalid request: id is required');
        }
        const album = getAlbumByLabel(req.params.label);
        if (!album) {
            res.status(404);
            throw new Error('Album not found');
        }
        // Update ID of album in db
        album[req.params.label].id = req.body.id;
        addAlbum(album);
        await writeDB();
        res.status(200).json(album);
    } catch (error) {
        next(error);
    }
};

export {
    updateLocalDatabase,
    updateAlbum
};