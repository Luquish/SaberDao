import { formatLogEntry } from "@saberhq/solana-contrib";
import { styleColor } from "../programLogsV2";
import { RenderedCPI } from "./RenderedCPI";
import { RenderedProgramError } from "./RenderedProgramError";
import React from "react";
export const prefixBuilder = (depth) => {
    const prefix = new Array(depth - 1).fill("\u00A0\u00A0").join("");
    return prefix + "> ";
};
export const RenderedLogEntry = ({ entry, currentProgramId, }) => {
    if (entry.type === "cpi") {
        return React.createElement(RenderedCPI, { entry: entry });
    }
    if (entry.type === "programError") {
        return (React.createElement(RenderedProgramError, { entry: entry, currentProgramId: currentProgramId }));
    }
    return (React.createElement("span", null,
        React.createElement("span", null, prefixBuilder(entry.depth)),
        React.createElement("span", { style: { color: styleColor(entry.type) } }, formatLogEntry(entry))));
};
