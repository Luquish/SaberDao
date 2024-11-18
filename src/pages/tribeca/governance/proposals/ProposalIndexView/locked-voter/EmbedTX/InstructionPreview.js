import { startCase } from "lodash-es";
import { useParsedInstruction } from "@/hooks/tx/useParsedInstruction";
import { shortenAddress } from "@/utils/utils";
import { AddressLink } from "@/common/AddressLink";
import { InstructionDisplay } from "../../../../../wallet/tx/TransactionView/TransactionIndexView/InstructionDisplay";
export const InstructionPreview = ({ instruction, index, }) => {
    const parsed = useParsedInstruction(instruction.ix);
    return (React.createElement("div", { tw: "grid border dark:border-warmGray-700 rounded" },
        React.createElement("div", { tw: "text-sm p-4" },
            React.createElement("h2", { tw: "font-semibold text-gray-800 dark:text-white mb-2" },
                "IX #",
                index + 1,
                ":",
                " ",
                parsed?.title ??
                    startCase((instruction.parsed && "name" in instruction.parsed
                        ? instruction.parsed.name
                        : null) ?? "Unknown")),
            React.createElement("p", { tw: "text-xs text-gray-500" },
                React.createElement("span", { tw: "font-medium" }, "Program:"),
                " ",
                React.createElement(AddressLink, { tw: "font-semibold text-secondary", address: instruction.ix.programId },
                    instruction.programName,
                    " (",
                    shortenAddress(instruction.ix.programId.toString()),
                    ")"))),
        React.createElement("div", { tw: "p-4 border-t dark:border-t-warmGray-600" },
            React.createElement(InstructionDisplay, { parsed: parsed, instruction: instruction }))));
};
