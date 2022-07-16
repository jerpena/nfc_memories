import kodi from 'kodi-ws';
import logger from '../lib/logger.js';
import CONFIG from './backend.js';

const connectToKodi = async () => {
    try {
        const conn = await kodi(CONFIG.KODI_IP, CONFIG.KODI_PORT);
        if (conn) {
            logger.info(`Connected to Kodi`);
        }
        return conn;
    } catch (error) {
        console.error(error);
    }
};

const conn = await connectToKodi();

export default conn;