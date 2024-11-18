import * as BufferLayout from "@solana/buffer-layout";
import { startCase } from "lodash-es";
const instructions = [
    "initializeBuffer",
    "write",
    "deployWithMaxDataLen",
    "upgrade",
    "setAuthority",
    "close",
];
export const makeUpgradeableLoaderInstructionData = (type) => {
    return Buffer.from([instructions.indexOf(type), 0, 0, 0]);
};
/**
 * See: <https://github.com/solana-labs/solana/blob/master/sdk/program/src/loader_upgradeable_instruction.rs>
 */
const accountLabels = {
    initializeBuffer: ["Buffer", "Buffer Authority"],
    write: ["Buffer", "Buffer Authority"],
    deployWithMaxDataLen: [
        "Payer",
        "Program Data",
        "Program",
        "Buffer",
        "Rent",
        "Clock",
        "Program Authority",
    ],
    upgrade: [
        "Program Data",
        "Program",
        "Buffer",
        "Spill",
        "Rent",
        "Clock",
        "Program Authority",
    ],
    setAuthority: ["Account", "Authority", "Next Authority"],
    close: ["Account", "Spill", "Authority", "Program"],
};
export const parseUpgradeableLoaderInstruction = (ix) => {
    const ixLayout = BufferLayout.struct([BufferLayout.u32("instruction")]);
    const { instruction } = ixLayout.decode(ix.data);
    const ixType = instructions[instruction];
    if (!ixType) {
        throw new Error("ix type");
    }
    return {
        type: ixType,
        name: startCase(ixType),
        accountLabels: accountLabels[ixType],
    };
};
