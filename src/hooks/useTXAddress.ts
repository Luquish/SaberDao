import { findTransactionAddress } from "@gokiprotocol/client";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export const useTXAddress = (smartWalletKey: PublicKey, index: number) => {
  return useQuery({
    queryKey: ["parsedTXAddress", smartWalletKey.toString(), index],
    queryFn: async () => {
      const [txKey] = await findTransactionAddress(smartWalletKey, index);
      return txKey;
    },
  });
};
