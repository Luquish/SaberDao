import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

import { generateSHA256BufferHash } from "../../src/utils/crypto";

export const useSha256Sum = (buffer?: Buffer | null) => {
  return useQuery({
    queryKey: ["sha256sum", buffer?.toString()],
    queryFn: async () => {
      invariant(buffer);
      return await generateSHA256BufferHash(buffer);
    },
    enabled: !!buffer,
  });
};

export const truncateShasum = (sum: string, leading = 4) =>
  `${sum.slice(0, leading)}...${sum.slice(-4)}`;
