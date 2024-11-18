import { formatName, NAMESPACES_IDL, NAMESPACES_PROGRAM_ID, REVERSE_ENTRY_SEED, } from "@cardinal/namespaces";
import { BorshCoder, utils } from "@project-serum/anchor";
import { useParsedAccountData } from "@rockooor/sail";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { SUNSBR_OWNER } from "./useAddressImage";
export const NamespaceCoder = new BorshCoder(NAMESPACES_IDL);
const decodeReverseEntry = (account) => {
    return NamespaceCoder.accounts.decode("reverseEntry", account.accountInfo.data);
};
export const useAddressName = (address) => {
    const { data: reverseEntryKey } = useQuery({
        queryKey: ["cardinalReverseEntry", address?.toString()],
        queryFn: async () => {
            invariant(address);
            const [reverseEntryId] = await PublicKey.findProgramAddress([utils.bytes.utf8.encode(REVERSE_ENTRY_SEED), address.toBytes()], NAMESPACES_PROGRAM_ID);
            return reverseEntryId;
        },
        enabled: !!address,
    });
    const { data: reverseEntry } = useParsedAccountData(reverseEntryKey, decodeReverseEntry);
    const displayName = useMemo(() => {
        if (!reverseEntry) {
            if (address?.equals(SUNSBR_OWNER)) {
                return "Sunny sunSBR";
            }
            return reverseEntry;
        }
        const { data } = reverseEntry.accountInfo;
        return formatName(data.namespaceName, data.entryName);
    }, [address, reverseEntry]);
    const loadingName = displayName === undefined;
    return { displayName, loadingName, reverseEntryKey };
};
export const useCardinalName = (address) => {
    const { displayName, loadingName } = useAddressName(address);
    if (!address) {
        return address;
    }
    if (loadingName) {
        return undefined;
    }
    return displayName ?? null;
};
export const useCardinalDisplayName = (address) => {
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
