import { displayAddress, programLabel } from "../../utils/tribeca/programs";
import { useProgramMeta } from "./deploydao/useProgramMeta";
const makeURL = (programID) => `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs/${programID}.json`;
export const fetchProgramMeta = async (address) => {
    const response = await fetch(makeURL(address));
    if (response.status === 404) {
        return null;
    }
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return (await response.json());
};
export const useProgramLabel = (programId) => {
    const { data: meta, isLoading } = useProgramMeta(programId?.toString());
    const label = meta?.program.label ??
        (isLoading
            ? programId
                ? displayAddress(programId.toString())
                : "Loading..."
            : programId
                ? programLabel(programId.toString()) ??
                    `Unknown (${programId.toString()}) Program`
                : "Unknown Program");
    return label;
};
