import { findOwnerInvokerAddress, findSmartWallet } from "@gokiprotocol/client";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
export const useSmartWalletAddress = (base) => {
    return useQuery({
        queryKey: ["walletKey", base?.toString()],
        queryFn: async () => {
            invariant(base);
            const [address] = await findSmartWallet(base);
            return address;
        },
        enabled: !!base,
    });
};
export const useOwnerInvokerAddress = (smartWallet, index = 0) => {
    return useQuery({
        queryKey: ["ownerInvoker", smartWallet?.toString()],
        queryFn: async () => {
            invariant(smartWallet);
            const [address] = await findOwnerInvokerAddress(smartWallet, index);
            return address;
        },
        enabled: !!smartWallet,
    });
};
