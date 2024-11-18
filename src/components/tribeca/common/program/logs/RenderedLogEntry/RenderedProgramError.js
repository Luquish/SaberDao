import { ProgramError } from "@project-serum/anchor";
import { useMemo } from "react";
import { useIDL } from "@/hooks/tribeca/useIDLs";
import { styleColor } from "../programLogsV2";
import { prefixBuilder } from ".";
import React from "react";
export const RenderedProgramError = ({ entry, currentProgramId, }) => {
    const { data: idl } = useIDL(currentProgramId);
    const errorParsed = useMemo(() => {
        try {
            const errorMap = new Map();
            idl?.idl?.errors?.forEach((err) => {
                errorMap.set(err.code, `${err.name}${err.msg ? `: ${err.msg}` : ""}`);
            });
            return ProgramError.parse(entry.text, errorMap);
        }
        catch (e) {
            return null;
        }
    }, [entry, idl]);
    return (React.createElement("span", null,
        React.createElement("span", null, prefixBuilder(entry.depth)),
        React.createElement("span", { style: { color: styleColor(entry.type) } },
            "Program returned error: ",
            entry.text,
            errorParsed && (React.createElement("span", { className: "text-slate-400" },
                " # ",
                errorParsed.message)))));
};
