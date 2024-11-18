import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { useEnvironment } from "../utils/useEnvironment";
export const useSignaturesForAddress = (address) => {
    const { network } = useEnvironment();
    const { connection } = useConnection();
    return useQuery({
        queryKey: ["signaturesForAddress", network, address?.toString()],
        queryFn: async () => {
            invariant(address);
            return await connection.getSignaturesForAddress(address, undefined, "confirmed");
        },
        enabled: !!address,
    });
};
