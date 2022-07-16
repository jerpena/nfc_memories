const replaceSpacesWithChar = (str, char = '_') => {
    return str.includes(' ') ?
        str.replaceAll(/ /g, `${char}`) : str;
};

export {
    replaceSpacesWithChar
};