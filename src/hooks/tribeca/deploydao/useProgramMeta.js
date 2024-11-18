import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import invariant from "tiny-invariant";
export const useProgramMetas = (addresses) => {
    return useQueries({
        queries: addresses.map((pid) => ({
            queryKey: ["sprMeta", pid],
            queryFn: async () => {
                if (!pid) {
                    return null;
                }
                return await fetchNullableWithSessionCache(`https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs/${pid}.json`);
            },
            enabled: !!pid,
        })),
    });
};
export const useProgramMeta = (address) => {
    const result = useProgramMetas(useMemo(() => [address], [address]))[0];
    invariant(result);
    return result;
};
