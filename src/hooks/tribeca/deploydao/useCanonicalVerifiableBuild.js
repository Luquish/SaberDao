import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
export const fetchCanonicalVerifiableBuild = async (checksum) => {
    if (!checksum) {
        return null;
    }
    return await fetchNullableWithSessionCache(`https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/releases/by-trimmed-checksum/${checksum}.json`);
};
export const useCanonicalVerifiableBuild = (checksum) => {
    return useQuery({
        queryKey: ["canonicalVerifiableBuild", checksum],
        queryFn: async () => {
            return fetchCanonicalVerifiableBuild(checksum);
        },
    });
};
