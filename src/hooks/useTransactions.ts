import { useConnection } from "@solana/wallet-adapter-react";
import type { TransactionSignature } from "@solana/web3.js";
import { useQueries } from "@tanstack/react-query";

import { useEnvironment } from "../utils/useEnvironment";

export const useTransactions = (txSigs: TransactionSignature[]) => {
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
