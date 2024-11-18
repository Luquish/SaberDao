import { PublicKey, Transaction } from "@solana/web3.js";
export const serializeToBase64 = (tx) => tx
    .serialize({
    requireAllSignatures: false,
    verifySignatures: false,
})
    .toString("base64");
export const makeTransaction = (network, ixs) => {
    const tx = new Transaction();
    tx.recentBlockhash = "GfVcyD4kkTrj4bKc7WA9sZCin9JDbdT4Zkd3EittNR1W";
    tx.feePayer =
        network === "devnet"
            ? new PublicKey("A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP")
            : new PublicKey("9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg");
    tx.instructions = ixs;
    return tx;
};
/**
 * Generates a link for inspecting the contents of a transaction.
 *
 * @returns URL
 */
export const generateInspectLink = (cluster, tx) => {
    return `https://anchor.so/tx/inspector?cluster=${cluster}&message=${encodeURIComponent(serializeToBase64(tx))}`;
};
