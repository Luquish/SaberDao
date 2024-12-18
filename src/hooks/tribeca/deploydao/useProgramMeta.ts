import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import invariant from "tiny-invariant";

import type { ProgramDetails } from "./types";

export const useProgramMetas = (addresses: (string | null | undefined)[]) => {
  return useQueries({
    queries: addresses.map((pid) => ({
      queryKey: ["sprMeta", pid],
      queryFn: async (): Promise<ProgramDetails | null> => {
        if (!pid) {
          return null;
        }
        return await fetchNullableWithSessionCache<ProgramDetails>(
          `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs/${pid}.json`
        );
      },
      enabled: !!pid,
    })),
  });
};

export const useProgramMeta = (address: string | null | undefined) => {
  const result = useProgramMetas(useMemo(() => [address], [address]))[0];
  invariant(result);
  return result;
};
