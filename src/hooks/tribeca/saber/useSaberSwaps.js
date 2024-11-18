import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { formatNetwork } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useEnvironment } from "../../../utils/tribeca/useEnvironment";
const parseRawSwap = ({ addresses: { admin, lpTokenMint, mergePool, quarry, reserves, swapAccount, swapAuthority, }, displayTokens, underlyingTokens, ...rest }) => {
    return {
        ...rest,
        addresses: {
            admin: new PublicKey(admin),
            lpTokenMint: new PublicKey(lpTokenMint),
            mergePool: new PublicKey(mergePool),
            quarry: new PublicKey(quarry),
            reserves: reserves.map((r) => new PublicKey(r)),
            swapAccount: new PublicKey(swapAccount),
            swapAuthority: new PublicKey(swapAuthority),
        },
        displayTokens: displayTokens.map((d) => new PublicKey(d)),
        underlyingTokens: underlyingTokens.map((d) => new PublicKey(d)),
    };
};
export const useSaberSwaps = () => {
    const { network } = useEnvironment();
    return useQuery({
        queryKey: ["saberSwaps", network],
        queryFn: async () => {
            const result = await fetchNullableWithSessionCache(`https://cdn.jsdelivr.net/gh/saber-hq/saber-registry-dist@master/data/swaps.${formatNetwork(network)}.json`);
            if (!result) {
                return null;
            }
            return result.map(parseRawSwap);
        },
    });
};
