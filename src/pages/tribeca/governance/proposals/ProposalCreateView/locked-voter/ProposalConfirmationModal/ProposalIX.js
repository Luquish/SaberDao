import { useParsedInstruction } from "@/hooks/tx/useParsedInstruction";
export const ProposalIX = ({ ix }) => {
    const parsedIX = useParsedInstruction(ix);
    return (React.createElement("div", { tw: "bg-gray bg-opacity-20 border border-warmGray-800 px-4 py-2 rounded text-sm font-semibold" }, parsedIX.title));
};
