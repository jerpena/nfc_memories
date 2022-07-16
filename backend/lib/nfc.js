import { SerialPort } from 'serialport';
import { PN532 } from 'pn532';
import CONFIG from '../config/backend.js';
import kodi from '../config/connectKodi.js';
import logger from './logger.js';
import { showNotification } from './kodi.js';
import { getAlbumById } from '../models/dbModel.js';
const controller = new AbortController();

// // setup serial port connection
// const serialPort = new SerialPort({
//     path: CONFIG.NFC_PATH,
//     baudRate: CONFIG.NFC_BAUD
// });
// // initialize PN532
// const nfc = new PN532(serialPort);

const setupNFC = () => {
    nfc.on('ready', () => {
        waitForTag();
    });
};

const waitForTag = () => {
    logger.debug('Waiting for nfc tag');
    // when a tag is scanned, a 'tag' event is emitted
    nfc.on('tag', tag => {
        const album = getAlbumById(tag.uid);
        if (!album) {
            showNotification({
                img: 'error',
                msg: 'No album has been found for this tag',
                title: 'NOT FOUND'
            });
        }
        logger.debug(`Tag UID: ${tag.uid}`);
        logger.debug(`Tag album: ${album ? album.label : `NOT FOUND`}`);
        //    playSlideshow(album.src);
    });
};

const getTag = async () => {
    nfc.removeAllListeners();
    const tag = await nfc.scanTag();
    waitForTag();
    logger.debug(nfc.eventNames());
    return tag;
};

// TODO: cancel async tag polling without throwing unhandled exception with AbortController


// const getTag = async () => {
//     return new Promise((res, rej) => {
//         setTimeout(() => {
//             rej(`Promise timed out`);
//         }, 20000);
//     });

// };

// const tags = async (options = {}) => {
//     const { signal } = options;

//     if (signal?.aborted === true) {
//         throw new Error(signal.reason);
//     }

//     const abortEventListener = () => {
//         throw new Error('aborting');
//     };

//     if (signal) {
//         signal.addEventListener("abort", abortEventListener, { once: true });
//     }
//     let tag;
//     try {
//         // Run some asynchronous code
//         // nfc.removeAllListeners();
//         tag = await getTag();
//         if (signal?.aborted === true) {
//             throw new Error(signal.reason);
//         }
//         // Run more asynchronous code
//     } finally {
//         if (signal) {
//             signal.removeEventListener("abort", abortEventListener);
//         }
//     }
//     return tag;
// };

const playSlideshow = albumSrc => {
    let args = [{ path: albumSrc }];
    kodi.run("Player.Open", args);
};

export {
    waitForTag,
    getTag,
    playSlideshow,
    setupNFC,
    controller,
};