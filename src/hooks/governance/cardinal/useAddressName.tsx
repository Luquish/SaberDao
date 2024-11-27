import type { ReverseEntryData } from "@cardinal/namespaces";
import {
  formatName,
  NAMESPACES_IDL,
  NAMESPACES_PROGRAM_ID,
  REVERSE_ENTRY_SEED,
} from "@cardinal/namespaces";
import { BorshCoder, utils } from "@project-serum/anchor";
import type { AccountParser } from "@rockooor/sail";
import { useParsedAccountData } from "@rockooor/sail";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import invariant from "tiny-invariant";

import { SUNSBR_OWNER } from "./useAddressImage";

export const NamespaceCoder = new BorshCoder(NAMESPACES_IDL);

const decodeReverseEntry: AccountParser<ReverseEntryData> = (account) => {
  return NamespaceCoder.accounts.decode<ReverseEntryData>(
    "reverseEntry",
    account.accountInfo.data
  );
};

export const useAddressName = (
  address: PublicKey | null | undefined
): {
  displayName: string | null | undefined;
  loadingName: boolean;
  reverseEntryKey?: PublicKey;
} => {
  const { data: reverseEntryKey } = useQuery({
    queryKey: ["cardinalReverseEntry", address?.toString()],
    queryFn: async () => {
      invariant(address);
      const [reverseEntryId] = await PublicKey.findProgramAddress(
        [utils.bytes.utf8.encode(REVERSE_ENTRY_SEED), address.toBytes()],
        NAMESPACES_PROGRAM_ID
      );
      return reverseEntryId;
    },
    enabled: !!address,
  });
  const { data: reverseEntry } = useParsedAccountData(
    reverseEntryKey,
    decodeReverseEntry
  );

  const displayName = useMemo(() => {
    if (!reverseEntry) {
      if (address?.equals(SUNSBR_OWNER)) {
        return "Sunny sunSBR";
      }
      return reverseEntry;
    }
    const { data } = reverseEntry.accountInfo;
    return formatName(data.namespaceName as string, data.entryName as string);
  }, [address, reverseEntry]);
  const loadingName = displayName === undefined;

  return { displayName, loadingName, reverseEntryKey };
};

export const useCardinalName = (
  address: PublicKey | undefined
): string | null | undefined => {
  const { displayName, loadingName } = useAddressName(address);
  if (!address) {
    return address;
  }
  if (loadingName) {
    return undefined;
  }
  return displayName ?? null;
};

export const useCardinalDisplayName = (
  address: PublicKey | null | undefined
): {
  displayName: string | null | undefined;
  name: string | null | undefined;
  reverseEntryKey?: PublicKey;
} => {
  const { displayName, loadingName, reverseEntryKey } = useAddressName(address);
  const name = !address
    ? address
    : loadingName
    ? undefined
    : displayName ?? null;
  if (name === null) {
    return { name, displayName: "Unknown User" };
  }
  return { name, displayName: name, reverseEntryKey };
};
