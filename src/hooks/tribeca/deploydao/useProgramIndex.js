import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
export const useProgramIndex = () => {
    return useQuery({
        queryKey: ["solanaProgramIndex"],
        queryFn: async () => {
            const result = await fetch("https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs.json");
            const parsed = (await result.json());
            return parsed.map((p) => ({ ...p, address: new PublicKey(p.address) }));
        },
    });
};
