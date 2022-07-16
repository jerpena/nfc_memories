import { fileURLToPath } from 'node:url';

const CONFIG = {
    KODI_IP: '192.168.1.67',
    KODI_PORT: 9090,
    PICTURES_SRC_LABEL: 'Pictures',
    DB: 'db.json',
    NFC_PATH: '/dev/ttyAMA0',
    NFC_BAUD: 115200,
};

CONFIG.DB_PATH = fileURLToPath(new URL(CONFIG.DB, import.meta.url));

export default CONFIG;