import { findTransactionAddress } from "@gokiprotocol/client";
import { useQuery } from "@tanstack/react-query";
export const useTXAddress = (smartWalletKey, index) => {
    return useQuery({
        queryKey: ["parsedTXAddress", smartWalletKey.toString(), index],
        queryFn: async () => {
            const [txKey] = await findTransactionAddress(smartWalletKey, index);
            return txKey;
        },
    });
};
