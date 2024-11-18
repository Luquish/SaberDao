import { structLayout, u64, Uint64Layout } from "@saberhq/token-utils";
import * as BufferLayout from "@solana/buffer-layout";
import { tokenInstructionTypes } from "./types";
export const parseTokenInstructionData = (type, keys, data) => {
    switch (type) {
        case "transfer": {
            const dataLayout = BufferLayout.struct([Uint64Layout("amount")]);
            const decoded = dataLayout.decode(data);
            const [source, destination, authority] = keys;
            if (!source || !destination || !authority) {
                return null;
            }
            const amount = u64.fromBuffer(Buffer.from(decoded.amount));
            return {
                source,
                destination,
                amount: amount.toString(),
                authority,
            };
        }
        case "transfer2": {
            const dataLayout = structLayout([Uint64Layout("amount"), BufferLayout.u8("decimals")]);
            const decoded = dataLayout.decode(data);
            const [source, mint, destination, authority] = keys;
            if (!source || !destination || !mint) {
                return null;
            }
            const amount = u64.fromBuffer(Buffer.from(decoded.amount));
            return {
                source,
                destination,
                mint,
                tokenAmount: {
                    amount: amount.toString(),
                    decimals: decoded.decimals,
                    uiAmountString: amount.toString(),
                },
                authority,
            };
        }
    }
    return null;
};
const accountLabels = {
    transfer: ["Source", "Destination", "Authority"],
    transfer2: ["Source", "Mint", "Destination", "Authority"],
};
export const parseTokenInstruction = (ix) => {
    const ixLayout = structLayout([BufferLayout.u8("instruction")]);
    const { instruction } = ixLayout.decode(ix.data);
    const rest = ix.data.slice(1);
    const ixType = tokenInstructionTypes[instruction];
    if (!ixType) {
        throw new Error("ix type");
    }
    const data = parseTokenInstructionData(ixType, ix.keys.map((k) => k.pubkey), rest);
    return {
        type: ixType,
        data,
        accountLabels: accountLabels[ixType],
    };
};
