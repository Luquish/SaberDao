import { extractErrorMessage } from "@rockooor/sail";
import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import { SystemInstruction, SystemProgram } from "@solana/web3.js";
import { startCase } from "lodash-es";
import { any, string, type } from "superstruct";
import { MEMO_PROGRAM_ID } from "../constants";
import { parseTokenInstruction } from "./token/parsers";
import { IX_TITLES } from "./token/types";
import { BPF_UPGRADEABLE_LOADER_ID } from "./upgradeable_loader/instructions";
import { parseUpgradeableLoaderInstruction } from "./upgradeable_loader/parsers";
export const ParsedInfo = type({
    type: string(),
    info: any(),
});
export const PARSERS = {
    [MEMO_PROGRAM_ID.toString()]: (ix) => {
        const text = ix.data.toString("utf-8");
        return { text, name: "Memo", program: "memo" };
    },
    [TOKEN_PROGRAM_ID.toString()]: (ix) => {
        const result = parseTokenInstruction(ix);
        const name = IX_TITLES[result.type];
        return { ...result, name, program: "token" };
    },
    [BPF_UPGRADEABLE_LOADER_ID.toString()]: (ix) => {
        const result = parseUpgradeableLoaderInstruction(ix);
        return { ...result, program: "upgradeable_loader" };
    },
    [SystemProgram.programId.toString()]: (ix) => {
        const ixType = SystemInstruction.decodeInstructionType(ix);
        const decoded = (() => {
            switch (ixType) {
                case "Transfer":
                    return SystemInstruction.decodeTransfer(ix);
                case "TransferWithSeed":
                    return SystemInstruction.decodeTransferWithSeed(ix);
                case "Create":
                    return SystemInstruction.decodeCreateAccount(ix);
                case "WithdrawNonceAccount":
                    return SystemInstruction.decodeNonceWithdraw(ix);
                default:
                    return null;
            }
        })();
        return {
            type: ixType,
            decoded,
            name: startCase(ixType),
            program: "system",
        };
    },
};
export class InstructionParseError extends Error {
    ix;
    originalError;
    constructor(ix, originalError) {
        super(extractErrorMessage(originalError) ?? "unknown");
        this.ix = ix;
        this.originalError = originalError;
        this.name = "InstructionParseError";
        if (originalError instanceof Error) {
            this.stack = originalError.stack;
        }
    }
}
export const parseNonAnchorInstruction = (ix) => {
    const parser = PARSERS[ix.programId.toString()];
    if (!parser) {
        return null;
    }
    try {
        return parser(ix);
    }
    catch (e) {
        return { error: new InstructionParseError(ix, e) };
    }
};
