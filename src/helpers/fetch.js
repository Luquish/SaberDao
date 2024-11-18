/**
 * Performs a GET request, returning `null` if 404.
 *
 * @param url
 * @param signal
 * @returns
 */
export const fetchNullable = async (url, signal) => {
    const resp = await fetch(url, { signal });
    if (resp.status === 404) {
        return null;
    }
    const info = (await resp.json());
    return info;
};
const sessionCache = {};
/**
 * Performs a GET request with a cache, returning `null` if 404.
 *
 * The cache expires on browser reload.
 *
 * @param url
 * @param signal
 * @returns
 */
export const fetchNullableWithSessionCache = async (url, signal) => {
    if (sessionCache[url]) {
        return sessionCache[url];
    }
    const result = await fetchNullable(url, signal);
    sessionCache[url] = result;
    return result;
};
