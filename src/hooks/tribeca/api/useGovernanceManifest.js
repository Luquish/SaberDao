import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { formatNetwork } from "@saberhq/solana-contrib";
import { useQuery } from "@tanstack/react-query";
import { loadGovernorConfig } from "@tribecahq/registry";
import { useEnvironment } from "../../../utils/tribeca/useEnvironment";
const makeManifestURL = (network, slug) => `https://raw.githubusercontent.com/TribecaHQ/tribeca-registry-build/master/registry/${formatNetwork(network)}/${slug}.json`;
export const useGovernanceManifest = (slug) => {
    const { network } = useEnvironment();
    return useQuery({
        queryKey: ["governanceManifest", network, slug],
        queryFn: async () => {
            const raw = await fetchNullableWithSessionCache(makeManifestURL(network, slug));
            if (!raw) {
                return null;
            }
            return loadGovernorConfig(raw);
        },
    });
};
