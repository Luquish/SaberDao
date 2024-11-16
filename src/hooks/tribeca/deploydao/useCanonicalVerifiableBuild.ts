import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";

import type { VerifiableProgramRelease } from "./types";

export const fetchCanonicalVerifiableBuild = async (checksum: string) => {
  if (!checksum) {
    return null;
  }
  return await fetchNullableWithSessionCache<VerifiableProgramRelease>(
    `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/releases/by-trimmed-checksum/${checksum}.json`
  );
};

export const useCanonicalVerifiableBuild = (checksum: string) => {
  return useQuery({
    queryKey: ["canonicalVerifiableBuild", checksum],
    queryFn: async () => {
      return fetchCanonicalVerifiableBuild(checksum);
    },
  });
};
