import { exists } from "@saberhq/solana-contrib";
import { useConnection } from "@solana/wallet-adapter-react";
import type { TransactionSignature } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import { useEnvironment } from "../../../../../../utils/useEnvironment";

export const useParsedTransaction = (
  signature: TransactionSignature | null | undefined
) => {
  const { connection } = useConnection();
  const { network } = useEnvironment();
  return useQuery({
    queryKey: ["getParsedTransaction", network, JSON.stringify(signature)],
    queryFn: async () => {
      if (!exists(signature)) {
        return signature;
      }
      return await connection.getParsedTransaction(signature, "confirmed");
    },
  });
};
