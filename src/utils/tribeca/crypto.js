// window.crypto.subtle is undefined on page served via http :(
const crypto = window?.crypto?.subtle ?? null;
const i2hex = (i) => {
    return ("00" + i.toString(16)).slice(-2);
};
const generateHexFromUint8Array = (arr) => Array.prototype.map.call(arr, i2hex).join("");
const generateSHA256HashNative = async (crypto, arrayBuffer) => {
    const buf = await crypto.digest("SHA-256", arrayBuffer);
    return new Uint8Array(buf);
};
const generateSHA256HashFallback = async (arrayBuffer) => {
    // npm install -E -D fast-sha256@1.3.0
    const { hash } = await import("fast-sha256");
    return hash(new Uint8Array(arrayBuffer));
};
export const generateSHA256BufferHash = async (buffer) => {
    const rawHash = await (crypto
        ? generateSHA256HashNative(crypto, buffer)
        : generateSHA256HashFallback(buffer));
    return generateHexFromUint8Array(rawHash);
};
