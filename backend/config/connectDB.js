import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'node:url';
import CONFIG from './backend.js';
import logger from '../lib/logger.js';


const defaultData = () => {
    const data = {
        config: {
            KODI_IP: 'localhost',
            KODI_PORT: 9090,
            PICTURES_SRC_LABEL: 'Pictures',
            DB: 'db.json',
            NFC_PATH: '/dev/ttyAMA0',
            NFC_BAUD: 115200,
        },
        albums: {}
    };
    data.config.DB_PATH = fileURLToPath(new URL(data.config.DB, import.meta.url));
    return data;
};

const loadDefaults = async db => {
    logger.error(`DB not found. Creating it and loading defaults`);
    db.data = defaultData();
    await db.write();
};

const connectDB = async () => {
    const adapter = new JSONFile(CONFIG.DB_PATH);
    const db = new Low(adapter);
    await db.read().catch(e => {
        // Unexpected end of JSON input, load the defaults
        loadDefaults(db);
    });
    // is null if json file not found, load defaults
    db.data === null ? loadDefaults(db) : logger.info(`${CONFIG.DB} loaded`);
    return db;
};

const conn = await connectDB();

export default conn;