import { truncateShasum } from "../../hooks/tribeca/useSha256Sum";
import { displayAddress } from "../../utils/tribeca/programs";
import React from "react";
export const BufferOption = ({ buffer }) => {
    const shasum = buffer.sha256Sum;
    return (React.createElement("option", { key: buffer.pubkey.toString(), value: buffer.pubkey.toString() },
        displayAddress(buffer.pubkey.toString()),
        ` (SHA256: ${truncateShasum(shasum)})`));
};
