import React from "react";
import { InstructionSummary } from "../program/InstructionSummary";
export const IXSummary = ({ instruction }) => {
    return React.createElement(InstructionSummary, { instruction: instruction });
};
