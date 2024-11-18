import { RECENT_BLOCKHASH_STUB, SolanaProvider, TransactionEnvelope, } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useProvider } from "../../../../hooks/tribeca/useProvider";
import { ExternalLink } from "../typography/ExternalLink";
import React from "react";
export const TransactionPreviewLink = ({ instructions, }) => {
    const { provider, providerMut, network } = useProvider();
    const txEnv = useMemo(() => {
        return new TransactionEnvelope(providerMut ??
            SolanaProvider.load({
                connection: provider.connection,
                sendConnection: provider.connection,
                wallet: {
                    publicKey: network === "devnet"
                        ? new PublicKey("A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP")
                        : new PublicKey("9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg"),
                    signTransaction: () => {
                        throw new Error("unimplemented");
                    },
                    signAllTransactions: () => {
                        throw new Error("unimplemented");
                    },
                },
            }), instructions.map((ix) => ({
            ...ix,
            data: Buffer.from(ix.data),
        })));
    }, [instructions, network, provider.connection, providerMut]);
    const inspectLink = useMemo(() => {
        const t = txEnv.build();
        t.recentBlockhash = RECENT_BLOCKHASH_STUB;
        return `https://${network === "mainnet-beta" ? "" : `${network}.`}anchor.so/tx/inspector?message=${encodeURIComponent(t.serializeMessage().toString("base64"))}`;
    }, [network, txEnv]);
    if (network === "localnet") {
        return React.createElement(React.Fragment, null);
    }
    return (React.createElement(ExternalLink, { href: inspectLink }, "View Details on Anchor.so"));
};
