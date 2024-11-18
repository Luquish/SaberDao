import { formatIdlType, SuperCoder } from "@saberhq/anchor-contrib";
import { createMemoInstruction } from "@saberhq/solana-contrib";
import { u64 } from "@saberhq/token-utils";
import { Transaction } from "@solana/web3.js";
import copyToClipboard from "copy-to-clipboard";
import { set, startCase } from "lodash-es";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { COMMON_ACCOUNTS } from "../../../../../utils/anchor";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";
import { AccountsForm } from "./AccountsForm";
import { PreviewIXModal } from "./PreviewIXModal";
const makeIX = ({ program, ix, rawArgs, accountsStrs, }) => {
    const accounts = {};
    Object.entries(accountsStrs).forEach(([key, account]) => {
        set(accounts, key, account);
    });
    const buildIX = program.instruction[ix.instruction.name];
    if (!buildIX) {
        throw new Error(`unknown instruction: ${ix.instruction.name}`);
    }
    const parsedArgs = rawArgs.map((arg, i) => {
        const cfg = ix.instruction.args[i];
        if (!cfg) {
            return arg;
        }
        if (cfg.type === "u64") {
            return new u64(arg);
        }
        if (typeof cfg.type !== "string") {
            return JSON.parse(arg);
        }
    });
    const txInstruction = buildIX(...parsedArgs, {
        accounts,
    });
    const coder = new SuperCoder(program.programId, program.idl);
    const formatted = coder.parseInstruction(txInstruction);
    return {
        txInstruction,
        formatted,
    };
};
const makeDefaults = (accounts) => {
    const result = {};
    accounts.forEach((item) => {
        if ("accounts" in item) {
            const other = makeDefaults(item.accounts);
            Object.entries(other).forEach(([otherKey, otherAddr]) => {
                result[`${item.name}.${otherKey}`] = otherAddr;
            });
            return;
        }
        const common = COMMON_ACCOUNTS[item.name];
        if (common) {
            result[item.name] = common.toString();
        }
    });
    return result;
};
export const IXForm = ({ ix, program, smartWallet, types = [], }) => {
    const [rawArgs, setRawArgs] = useState(new Array(ix.instruction.args.length).map(() => ""));
    const [accountsStrs, setAccountsStrs] = useState(makeDefaults(ix.instruction.accounts));
    const [memo, setMemo] = useState("");
    const builtIX = useMemo(() => {
        try {
            return makeIX({ program, ix, rawArgs, accountsStrs });
        }
        catch (e) {
            console.error("ERROR", e);
            // ignore
            return null;
        }
    }, [accountsStrs, ix, program, rawArgs]);
    const [showPreview, setShowPreview] = useState(false);
    const renderInputTextBox = (field, index) => {
        return (React.createElement(InputText, { key: field.name, type: "text", placeholder: field.name, value: rawArgs[index]?.toString() ?? "", onChange: (e) => {
                setRawArgs((prev) => {
                    const next = prev.slice();
                    next[index] = e.target.value;
                    return next;
                });
            } }));
    };
    const renderUserDefinedTypes = (typeDef) => {
        if (!typeDef) {
            return React.createElement("div", null, "Unsupported");
        }
        switch (typeDef.type.kind) {
            case "struct":
                return (React.createElement("div", null,
                    React.createElement("div", { tw: "grid gap-2" }, typeDef.type.fields.map((f, i) => (React.createElement(React.Fragment, null,
                        React.createElement("span", null,
                            startCase(f.name),
                            " (",
                            formatIdlType(f.type),
                            ")"),
                        renderInputTextBox(f, i)))))));
            default:
                return React.createElement("div", null, "Unsupported");
        }
    };
    const renderIdlField = (field, index) => {
        if (typeof field.type === "string") {
            return renderInputTextBox(field, index);
        }
        if ("struct" in field) {
            return renderUserDefinedTypes(types.find((t) => t.name === formatIdlType(field.type)));
        }
        return React.createElement("div", null, "Unsupported");
    };
    return (React.createElement("div", { tw: "grid gap-4" },
        builtIX && (React.createElement(PreviewIXModal, { ix: ix, txInstructions: memo === ""
                ? [builtIX.txInstruction]
                : [builtIX.txInstruction, createMemoInstruction(memo, [])], formatted: builtIX.formatted, isOpen: showPreview, smartWallet: smartWallet, onDismiss: () => {
                setShowPreview(false);
            } })),
        React.createElement("h2", { tw: "text-xl font-semibold mb-4" }, startCase(ix.instruction.name)),
        ix.instruction.args.length > 0 && (React.createElement("div", null,
            React.createElement("h3", { tw: "text-lg font-semibold mb-2" }, "Arguments"),
            React.createElement("div", { tw: "grid gap-2" }, ix.instruction.args.map((arg, i) => (React.createElement("label", { key: `arg_${i}`, tw: "grid gap-1 grid-cols-2" },
                React.createElement("span", null,
                    startCase(arg.name),
                    " (",
                    formatIdlType(arg.type),
                    ")"),
                renderIdlField(arg, i))))))),
        React.createElement("div", null,
            React.createElement("h3", { tw: "text-lg font-semibold mb-2" }, "Accounts"),
            React.createElement("div", null,
                React.createElement(AccountsForm, { accountItems: ix.instruction.accounts, accountsStrs: accountsStrs, prefix: "", onChange: (path, key) => {
                        setAccountsStrs((value) => ({
                            ...value,
                            [path]: key,
                        }));
                    } }))),
        React.createElement("div", { tw: "flex flex-col gap-2 text-sm" },
            React.createElement("span", { tw: "font-medium" }, "Memo (optional)"),
            React.createElement(InputText, { type: "text", value: memo, onChange: (e) => {
                    setMemo(e.target.value);
                } })),
        React.createElement("div", { tw: "flex gap-2" },
            React.createElement(Button, { disabled: !builtIX, type: "button", variant: "primary", onClick: () => {
                    setShowPreview(true);
                } }, "Preview Instruction"),
            React.createElement(Button, { type: "button", disabled: !builtIX, onClick: () => {
                    invariant(builtIX);
                    const tx = new Transaction();
                    tx.recentBlockhash = "GfVcyD4kkTrj4bKc7WA9sZCin9JDbdT4Zkd3EittNR1W";
                    tx.feePayer = builtIX.txInstruction.programId;
                    tx.instructions = [builtIX.txInstruction];
                    copyToClipboard(tx
                        .serialize({
                        requireAllSignatures: false,
                        verifySignatures: false,
                    })
                        .toString("base64"));
                } }, "Copy as base64"))));
};
