import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { exists } from "@saberhq/solana-contrib";
import { useQuery } from "@tanstack/react-query";
/**
 * Uses JSON data from a URL which will not expire until the page is refreshed.
 * @param url
 * @returns
 */
export const useStaticGetRequest = (url, options = {}) => {
    return useQuery({
        queryKey: ["getRequest", url],
        queryFn: async () => {
            if (!exists(url)) {
                return url;
            }
            return await fetchNullableWithSessionCache(url);
        },
        staleTime: Infinity,
        ...options,
    });
};
