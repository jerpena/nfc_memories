// Kodi utility functions
import kodi from '../config/connectKodi.js';

const showNotification = alert => {
    kodi.GUI.ShowNotification({
        image: alert.img,
        message: alert.msg,
        title: alert.title
    });
};

export {
    showNotification,
};