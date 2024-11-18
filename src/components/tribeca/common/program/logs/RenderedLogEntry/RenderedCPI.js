import { usePubkey } from "@rockooor/sail";
import { useProgramLabel } from "@/hooks/tribeca/useProgramMeta";
import { styleColor } from "../programLogsV2";
import { prefixBuilder } from ".";
import React from "react";
export const RenderedCPI = ({ entry }) => {
    const programId = usePubkey(entry.programAddress);
    const label = useProgramLabel(programId);
    return (React.createElement("span", null,
        React.createElement("span", null, prefixBuilder(entry.depth)),
        React.createElement("span", { style: { color: styleColor(entry.type) } },
            "Invoking ",
            label)));
};
