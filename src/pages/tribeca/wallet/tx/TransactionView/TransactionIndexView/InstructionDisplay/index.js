import { AttributeList } from "@/common/AttributeList";
import { Box } from "./Box";
import { IXAccounts } from "./IXAccounts";
import { IXArguments } from "./IXArguments";
import { IXData } from "./IXData";
export const InstructionDisplay = ({ instruction, parsed, }) => {
    return (React.createElement("div", { tw: "grid gap-4" },
        parsed.data.type === "raw" && (React.createElement(IXData, { data: Buffer.from(parsed.data.data), error: instruction.parsed && "error" in instruction.parsed
                ? instruction.parsed.error
                : null })),
        parsed.data.type === "anchor" && React.createElement(IXArguments, { args: parsed.data.args }),
        parsed.data.type === "object" && (React.createElement(Box, { title: "Arguments", tw: "p-0" },
            React.createElement(AttributeList, { attributes: parsed.data.args }))),
        React.createElement(IXAccounts, { accounts: parsed.accounts })));
};
