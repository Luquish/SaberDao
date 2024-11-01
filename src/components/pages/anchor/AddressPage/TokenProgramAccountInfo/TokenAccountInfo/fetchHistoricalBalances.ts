import { useConnection } from "@solana/wallet-adapter-react";
import type {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import { useEnvironment } from "../../../../../../utils/useEnvironment";
import { SLOT_OF_HACK } from "../../../address/CashioVerifyPage/useBalanceAtTimeOfHack";

export const fetchSignaturesForAddress = async ({
  connection,
  address,
  earliestSlot = SLOT_OF_HACK,
  limit = 1_000,
}: {
  connection: Connection;
  address: PublicKey;
  earliestSlot?: number;
  limit?: number;
}): Promise<ConfirmedSignatureInfo[]> => {
  const signatures: ConfirmedSignatureInfo[] = [];

  let lastSlotFetched = 2 ** 53 - 1;
  let before: string | undefined = undefined;

  while (lastSlotFetched >= earliestSlot) {
    const fetchedSignatures: readonly ConfirmedSignatureInfo[] = (
      await connection.getSignaturesForAddress(
        address,
        {
          limit,
          before,
        },
        "confirmed"
      )
    )
      // sort descending slot
      .sort((a, b) => b.slot - a.slot);

    const cutoff = fetchedSignatures.findIndex(
      (sig) => sig.slot < earliestSlot
    );

    if (cutoff !== -1) {
      signatures.push(...fetchedSignatures.slice(0, cutoff + 1));
      return signatures;
    }

    const lastFetchedSignature =
      fetchedSignatures[fetchedSignatures.length - 1];
    before = lastFetchedSignature?.signature;
    lastSlotFetched = lastFetchedSignature?.slot ?? 0;

    signatures.push(...fetchedSignatures);
  }
  return signatures;
};

export const useSignaturesForAddress = (address?: PublicKey) => {
  const { connection } = useConnection();
  const { network } = useEnvironment();
  return useQuery({
    queryKey: ["signaturesForAddress", network, address?.toString()],
    queryFn: async () => {
      if (!address) {
        return address;
      }
      return await fetchSignaturesForAddress({
        connection,
        address,
      });
    },
  });
};
