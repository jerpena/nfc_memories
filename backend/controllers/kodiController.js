import kodi from '../config/connectKodi.js';
import { getTag, controller } from '../lib/nfc.js';

const scanTag = async (req, res, next) => {
    try {
        const timeout = setTimeout(() => {
            controller.abort();
            throw new Error('Scan error');
        }, 3000);
        const tag = await getTag(controller);
        clearTimeout(timeout);
        if (tag) {
            return res.status(200).json({ id: tag.id });
        }
        // throw new Error('Scan error');
    } catch (error) {
        next(error);
    }
};

export { scanTag };