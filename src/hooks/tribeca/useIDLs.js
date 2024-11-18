import { useConnection } from "@solana/wallet-adapter-react";
import { useQueries } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { fetchIDL } from "../utils/fetchers";
import { KNOWN_NON_ANCHOR_PROGRAMS } from "../utils/programs";
export const useIDLs = (idls) => {
    const { connection } = useConnection();
    return useQueries({
        queries: idls.map((pid) => ({
            queryKey: ["idl", pid?.toString()],
            queryFn: async () => {
                invariant(pid);
                if (KNOWN_NON_ANCHOR_PROGRAMS.has(pid.toString())) {
                    return { programID: pid, idl: null };
                }
                return {
                    programID: pid,
                    idl: await fetchIDL(connection, pid.toString()),
                };
            },
            enabled: !!pid,
            staleTime: Infinity,
        })),
    });
};
export const useIDL = (address) => {
    const ret = useIDLs([address])[0];
    invariant(ret);
    return ret;
};
