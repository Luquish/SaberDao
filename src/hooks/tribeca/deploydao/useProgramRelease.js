import { useQuery } from "@tanstack/react-query";
export const useProgramRelease = (org, programName, version) => {
    return useQuery({
        queryKey: ["programRelease", org, programName, version],
        queryFn: async () => {
            const result = await fetch(`https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/releases/by-name/%40${org}/${programName}%40${version}.json`);
            if (result.status === 404) {
                return null;
            }
            const parsed = (await result.json());
            return parsed;
        },
    });
};
