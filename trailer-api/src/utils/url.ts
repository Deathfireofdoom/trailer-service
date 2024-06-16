
export const validateUrl = (url: string): Boolean => {
    const baseUrl = 'https://content.viaplay.se/pc-se/film/';
    if (!url.startsWith(baseUrl)) {
        return false;
    }
    // we could also add more rules, like regex matching if obtain
    // more info on how it should look like.
    return true;
}