import {
  findRedeemerKey,
  SABER_IOU_MINT,
  SBR_ADDRESS,
} from "@saberhq/saber-periphery";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import { useSaberRedeemerData } from "../../../../../../../utils/parsers";

export const useRedeemer = (iouMint: PublicKey = SABER_IOU_MINT) => {
  const { data: redeemerKey } = useQuery({
    queryKey: ["saberRedeemerKey", iouMint.toString()],
    queryFn: async () => {
      const [redeemerKey] = await findRedeemerKey({
        iouMint,
        redemptionMint: SBR_ADDRESS,
      });
      return redeemerKey;
    },
  });
  return useSaberRedeemerData(redeemerKey);
};
