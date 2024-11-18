import { Keypair } from "@solana/web3.js";
import { useMemo } from "react";
export const useKeypair = (valueStr) => {
    return useMemo(() => {
        if (!valueStr) {
            return null;
        }
        try {
            return Keypair.fromSecretKey(Uint8Array.from([...JSON.parse(valueStr)]));
        }
        catch (e) {
            return null;
        }
    }, [valueStr]);
};
