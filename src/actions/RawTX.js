import { extractErrorMessage } from "@rockooor/sail";
import { Transaction } from "@solana/web3.js";
import { HelperCard } from "../components/tribeca/common/HelperCard";
import { Textarea } from "../components/tribeca/common/inputs/InputText";
import { LabeledInput } from "../components/tribeca/common/inputs/LabeledInput";
import React from "react";
export const RawTX = ({ setError, txRaw, setTxRaw, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(HelperCard, { variant: "warn" },
            React.createElement("div", { className: "font-semibold" }, "Warning: this page is for advanced users only. Invalid transaction data may cause this page to freeze. Documentation will be coming soon.")),
        React.createElement(HelperCard, { variant: "muted" },
            React.createElement("div", { className: "prose prose-sm prose-light" },
                React.createElement("p", null, "This page allows proposing any arbitrary transaction for execution by the DAO. The fee payer and recent blockhash will not be used."))),
        React.createElement(LabeledInput, { label: "Transaction (base64)", Component: Textarea, id: "instructionsRaw", className: "h-auto font-mono", rows: 4, placeholder: "Paste raw base64 encoded transaction message", value: txRaw, onChange: (e) => {
                setTxRaw(e.target.value);
                try {
                    const buffer = Buffer.from(e.target.value, "base64");
                    const tx = Transaction.from(buffer);
                    if (tx.instructions.length === 0) {
                        throw new Error("no instruction data");
                    }
                    setError(null);
                }
                catch (err) {
                    setError(`Invalid transaction data: ${extractErrorMessage(err) ?? "(unknown)"}`);
                }
            } })));
};
