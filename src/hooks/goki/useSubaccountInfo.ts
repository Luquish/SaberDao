import { findSubaccountInfoAddress } from "@gokiprotocol/client";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

import { useSubaccountInfoData } from "../../utils/parsers";

export const useSubaccountInfo = (key: PublicKey | null | undefined) => {
  const { data: subaccountInfoKey } = useQuery({
    queryKey: ["subaccountInfoKey", key?.toString()],
    queryFn: async (): Promise<PublicKey> => {
      invariant(key);
      const [sub] = await findSubaccountInfoAddress(key);
      return sub;
    },
    enabled: !!key,
  });
  return useSubaccountInfoData(subaccountInfoKey);
};
