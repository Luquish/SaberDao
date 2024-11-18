import { useCallback, useState } from "react";
export function useLocalStorageState(key, defaultState) {
    const [state, setState] = useState(() => {
        // NOTE: Not sure if this is ok
        const storedState = localStorage.getItem(key);
        if (storedState) {
            return JSON.parse(storedState);
        }
        return defaultState;
    });
    const setLocalStorageState = useCallback((newState) => {
        const changed = state !== newState;
        if (!changed) {
            return;
        }
        setState(newState);
        if (newState === null) {
            localStorage.removeItem(key);
        }
        else {
            localStorage.setItem(key, JSON.stringify(newState));
        }
    }, [state, key]);
    return [state, setLocalStorageState];
}
/**
 * shorten the checksummed version of the input address to have 4 characters at start and end
 * @param address
 * @param chars
 * @returns
 */
export function shortenAddress(address, chars = 5) {
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}
/**
 * Converts a Solana timestamp to a Date.
 *
 * @param num
 * @returns
 */
export const tsToDate = (num) => new Date(num.toNumber() * 1_000);
export const gokiTXLink = (tx) => `https://goki.so/wallets/${tx.smartWallet.toString()}/tx/${tx.index.toString()}`;
