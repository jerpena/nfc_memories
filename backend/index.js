import jsonfile from "jsonfile";
import kodi from "kodi-ws";
import { PN532 } from "pn532";
import { SerialPort } from "serialport";

const CONFIG = {
    KODI_IP: '192.168.1.66',
    KODI_PORT: 9090,
    PICTURES_SRC_LABEL: 'Pictures',
};

const main = async () => {
    // Connect to KODI instance
    const conn = await kodi(CONFIG.KODI_IP, CONFIG.KODI_PORT);
    const picSource = await getPictureSource(conn);
    console.log(picSource);
};

const getPictureSource = async conn => {
    const album = await conn.Files.GetSources("pictures");
    // Get source that contains the label defined in config
    const source = album.sources.find(src =>
        src.label.includes(CONFIG.PICTURES_SRC_LABEL)
    );
    return source.file;
};


main().catch(e => {
    if (e.stack) return console.error(e.stack);
    console.error(e);
}).then(() => {
    process.exit();
});