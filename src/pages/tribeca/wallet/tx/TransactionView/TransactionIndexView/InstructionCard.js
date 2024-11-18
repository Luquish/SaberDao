import { shortenAddress } from "@cardinal/namespaces";
import { useParsedInstruction } from "@/hooks/tx/useParsedInstruction";
import { AddressLink } from "../../../../../common/AddressLink";
import { InstructionSummary } from "../../../../../common/program/InstructionSummary";
import { InstructionDisplay } from "./InstructionDisplay";
export const InstructionCard = ({ instruction, index, }) => {
    const parsed = useParsedInstruction(instruction.ix);
    return (React.createElement("div", { tw: "grid border" },
        React.createElement("div", { tw: "text-sm p-4" },
            React.createElement("h2", { tw: "font-semibold text-gray-800 mb-2" },
                "IX #",
                index + 1,
                ": ",
                React.createElement(InstructionSummary, { instruction: instruction.ix })),
            React.createElement("p", { tw: "text-xs text-gray-500" },
                React.createElement("span", { tw: "font-medium" }, "Program:"),
                " ",
                React.createElement(AddressLink, { tw: "font-semibold text-secondary", address: instruction.ix.programId },
                    instruction.programName,
                    " (",
                    shortenAddress(instruction.ix.programId.toString()),
                    ")"))),
        React.createElement("div", { tw: "p-4 border-t" },
            React.createElement(InstructionDisplay, { instruction: instruction, parsed: parsed }))));
};
