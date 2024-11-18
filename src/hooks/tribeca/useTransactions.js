import { useConnection } from "@solana/wallet-adapter-react";
import { useQueries } from "@tanstack/react-query";
import { useEnvironment } from "../../utils/tribeca/useEnvironment";
export const useTransactions = (txSigs) => {
    const { network } = useEnvironment();
    const { connection } = useConnection();
    return useQueries({
        queries: txSigs.map((sig) => {
            return {
                queryKey: ["txSig", network, sig],
                queryFn: async () => {
                    const tx = await connection.getTransaction(sig, {
                        commitment: "confirmed",
                    });
                    if (!tx) {
                        return null;
                    }
                    return {
                        sig,
                        tx,
                    };
                },
            };
        }),
    });
};
