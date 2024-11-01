import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { exists } from "@saberhq/solana-contrib";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

/**
 * Uses JSON data from a URL which will not expire until the page is refreshed.
 * @param url
 * @returns
 */
export const useStaticGetRequest = <T, U = T>(
  url: string | null | undefined,
  options: Omit<
    UseQueryOptions<
      T | null | undefined,
      unknown,
      U | null | undefined,
      [string, string | null | undefined]
    >,
    "queryKey" | "queryFn"
  > = {}
) => {
  return useQuery({
    queryKey: ["getRequest", url],
    queryFn: async (): Promise<T | null | undefined> => {
      if (!exists(url)) {
        return url;
      }
      return await fetchNullableWithSessionCache<T>(url);
    },

    staleTime: Infinity,
    ...options,
  });
};
