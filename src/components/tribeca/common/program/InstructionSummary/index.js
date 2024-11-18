import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import { useParsedProposalInstruction } from "../../../../../hooks/tribeca/tx/useParsedInstruction";
import { BPF_UPGRADEABLE_LOADER_ID } from "../../../../../hooks/tribeca/useAuthorityPrograms";
import { UpgradeProgramInstruction } from "./bpf_upgradeable/UpgradeProgramInstruction";
import { TokenTransferInstruction } from "./token/TokenTransferInstruction";
import React from "react";
/**
 * Human readable summary of an instruction.
 *
 * This is not just text.
 *
 * @param param0
 * @returns
 */
export const InstructionSummary = ({ instruction }) => {
    const ix = useParsedProposalInstruction(instruction);
    if (ix.programID.equals(BPF_UPGRADEABLE_LOADER_ID) &&
        ix.data.type === "object") {
        const result = ix.data.args;
        if (result.type === "upgrade") {
            return React.createElement(UpgradeProgramInstruction, { data: ix });
        }
    }
    if (ix.programID.equals(TOKEN_PROGRAM_ID) && ix.data?.type === "object") {
        const result = ix.data.args;
        if (result.type === "transfer" && result.data) {
            return React.createElement(TokenTransferInstruction, { transfer: result.data });
        }
    }
    return React.createElement(React.Fragment, null, ix.title);
};
