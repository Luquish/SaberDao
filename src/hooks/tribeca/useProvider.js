import { SignerWallet, SolanaProvider, TransactionEnvelope, } from "@saberhq/solana-contrib";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { useMemo } from "react";
import { useEnvironment } from "../utils/useEnvironment";
export function useProvider() {
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const { network } = useEnvironment();
    const { provider, providerMut } = useMemo(() => {
        const provider = SolanaProvider.init({
            connection,
            wallet: wallet ?? new SignerWallet(Keypair.generate()),
        });
        if (wallet) {
            return { provider, providerMut: provider };
        }
        return { provider: provider, providerMut: null };
    }, [connection, wallet]);
    return {
        connected: !!wallet,
        network,
        provider,
        providerMut,
        newTX: (instructions = [], signers = []) => {
            return TransactionEnvelope.create(provider, instructions, signers);
        },
    };
}
