import type { EntryData } from "@cardinal/namespaces";
import {
  ENTRY_SEED,
  NAMESPACE_SEED,
  NAMESPACES_PROGRAM_ID,
} from "@cardinal/namespaces";
import { utils } from "@project-serum/anchor";
import type { AccountParser } from "@rockooor/sail";
import { useParsedAccountData, usePubkey } from "@rockooor/sail";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import { NamespaceCoder } from "./useAddressName";

const decodeName: AccountParser<EntryData> = (account) => {
  return NamespaceCoder.accounts.decode<EntryData>(
    "entry",
    account.accountInfo.data
  );
};

export const useCardinalResolvedAddress = (
  name: string
): PublicKey | null | undefined => {
  const pubkey = usePubkey(name);
  const { data: address } = useQuery({
    queryKey: ["cardinalAddress", name],
    queryFn: async () => {
      const [namespace, entry] = name.startsWith("@")
        ? ["twitter", name.slice(1)]
        : name.split(".").reverse();

      if (!namespace || !entry) {
        return null;
      }
      const [namespaceId] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode(NAMESPACE_SEED),
          utils.bytes.utf8.encode(namespace),
        ],
        NAMESPACES_PROGRAM_ID
      );
      const [entryId] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode(ENTRY_SEED),
          namespaceId.toBytes(),
          utils.bytes.utf8.encode(entry),
        ],
        NAMESPACES_PROGRAM_ID
      );
      return entryId;
    },
  });
  const { data: entry } = useParsedAccountData(address, decodeName);

  return (entry?.accountInfo.data.data as PublicKey | undefined) ?? pubkey;
};
