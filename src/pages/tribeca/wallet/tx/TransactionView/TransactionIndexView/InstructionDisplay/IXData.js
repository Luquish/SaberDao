import { chunks } from "@rockooor/sail";
import { Box } from "./Box";
export const IXData = ({ data, error }) => {
    return (React.createElement(Box, { title: `Instruction Data (${data.length} bytes)` },
        error && (React.createElement("div", { tw: "text-red-500 text-sm mb-2" },
            "Error parsing instruction: ",
            error.message)),
        data.length > 0 ? (React.createElement("pre", { tw: "whitespace-pre-wrap bg-accent-50 bg-opacity-30 px-3 py-2 border border-accent-100 rounded" },
            React.createElement("code", null, chunks(data.toString("hex").split(""), 2)
                .map((x) => x.join(""))
                .join(" ")))) : (React.createElement("span", { tw: "text-secondary text-sm" },
            React.createElement("em", null, "(empty)")))));
};
