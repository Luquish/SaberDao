import { extractErrorMessage, useAccountData, useTXHandlers, } from "@rockooor/sail";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import React from 'react';
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor, useGovWindowTitle, } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { HelperCard } from "@/components/tribeca/common/HelperCard";
import { InputText, Textarea } from "@/components/tribeca/common/inputs/InputText";
import { LabeledInput } from "@/components/tribeca/common/inputs/LabeledInput";
import { ProposalConfirmModal } from "./ProposalConfirmationModal";
import { ProposalTXForm } from "./ProposalTXForm";
export const ProposalCreateInner = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [discussionLink, setDiscussionLink] = useState("");
    const [txRaw, setTxRaw] = useState("");
    const [theError, setError] = useState(null);
    const { minActivationThreshold, manifest } = useGovernor();
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    useGovWindowTitle(`Create Proposal`);
    const proposalCfg = manifest?.proposals;
    const discussionRequired = !!proposalCfg?.discussion?.required;
    const { tx, error: parseError } = useMemo(() => {
        try {
            const buffer = Buffer.from(txRaw, "base64");
            const tx = Transaction.from(buffer);
            if (tx.instructions.length === 0) {
                return { error: "Transaction cannot be empty" };
            }
            return { tx };
        }
        catch (e) {
            return {
                error: extractErrorMessage(e),
            };
        }
    }, [txRaw]);
    const error = discussionRequired && !discussionLink
        ? "Discussion link is required"
        : proposalCfg?.discussion?.prefix &&
            !discussionLink.startsWith(proposalCfg.discussion.prefix)
            ? "Invalid discussion link"
            : theError ?? parseError;
    const [showConfirm, setShowConfirm] = useState(false);
    const { ownerInvokerKey } = useExecutiveCouncil();
    // check to see if the payer is involved
    const payerMut = !!ownerInvokerKey &&
        !!tx?.instructions
            .flatMap((ix) => ix.keys)
            .find((meta) => meta.pubkey.equals(ownerInvokerKey) &&
            meta.isWritable &&
            meta.isSigner)
        ? ownerInvokerKey
        : null;
    const { data: payerMutData } = useAccountData(payerMut);
    const currentPayerBalance = payerMutData === undefined
        ? undefined
        : (payerMutData?.accountInfo.lamports ?? 0) / LAMPORTS_PER_SOL;
    return (React.createElement(React.Fragment, null,
        React.createElement(ProposalConfirmModal, { isOpen: showConfirm, onDismiss: () => {
                setShowConfirm(false);
            }, proposal: {
                title,
                description: discussionLink
                    ? `${description}\n\n[View Discussion](${discussionLink})`
                    : description,
                instructions: tx?.instructions ?? [],
            } }),
        React.createElement("div", { className: "flex flex-col gap-8 md:grid md:grid-cols-[400px_1fr]" },
            React.createElement("div", null,
                React.createElement(Card, { title: "Proposal Info" },
                    React.createElement("div", { className: "grid gap-4 px-7 py-6" },
                        React.createElement(HelperCard, { variant: "muted" },
                            React.createElement("div", { className: "leading-loose" },
                                React.createElement("p", { className: "text-white mb-2" }, "You are creating a proposal draft."),
                                React.createElement("p", null,
                                    "If activated by a a DAO member with at least",
                                    " ",
                                    React.createElement("strong", null, minActivationThreshold?.formatUnits()),
                                    ", the members of the DAO may vote to execute or reject the proposal."))),
                        proposalCfg?.notice && (React.createElement(HelperCard, { variant: "primary" },
                            React.createElement("div", { className: "prose prose-invert" },
                                React.createElement(ReactMarkdown, null, proposalCfg.notice)))),
                        React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "title" },
                            React.createElement("span", { className: "text-sm" }, "Title (max 140 characters)"),
                            React.createElement(InputText, { id: "title", placeholder: "A short summary of your proposal.", value: title, maxLength: 140, onChange: (e) => setTitle(e.target.value) })),
                        React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "description" },
                            React.createElement("span", { className: "text-sm" }, "Description (max 750 characters)"),
                            React.createElement(Textarea, { id: "description", className: "h-auto", rows: 4, maxLength: 750, placeholder: `## Summary\nYour proposal will be formatted using Markdown.`, value: description, onChange: (e) => setDescription(e.target.value) })),
                        proposalCfg?.discussion?.required && (React.createElement(React.Fragment, null,
                            React.createElement(LabeledInput, { Component: InputText, id: "discussionLink", required: true, label: "Link to discussion (required)", placeholder: `URL must start with "${proposalCfg?.discussion.prefix ?? ""}"`, type: "text", value: discussionLink, onChange: (e) => setDiscussionLink(e.target.value), error: !discussionLink.startsWith(proposalCfg.discussion.prefix ?? "")
                                    ? "Invalid discussion link"
                                    : undefined, touched: true })))))),
            React.createElement("div", { className: "flex flex-col gap-4" },
                React.createElement(Card, { title: "Proposal Action" },
                    React.createElement("div", { className: "grid gap-4 px-7 py-6" },
                        React.createElement(ProposalTXForm, { setError: setError, txRaw: txRaw, setTxRaw: setTxRaw }))),
                React.createElement("div", { className: "flex gap-4" },
                    payerMut &&
                        currentPayerBalance !== undefined &&
                        currentPayerBalance < 0.5 && (React.createElement(AsyncButton, { className: "flex-1", size: "md", onClick: async ({ provider }) => {
                            await signAndConfirmTX(await wrapTx(provider.newTX([
                                SystemProgram.transfer({
                                    fromPubkey: provider.walletKey,
                                    toPubkey: payerMut,
                                    lamports: LAMPORTS_PER_SOL,
                                }),
                            ])));
                        } },
                        React.createElement("div", { className: "flex flex-col" },
                            React.createElement("span", null, "Fund with 1 SOL"),
                            React.createElement("span", { className: "text-xs" },
                                "(payer balance: ",
                                currentPayerBalance.toLocaleString(),
                                " ",
                                "SOL)")))),
                    React.createElement(Button, { className: "flex-1", size: "md", type: "button", disabled: !(tx && title && description) || !!error, variant: "primary", onClick: () => {
                            setShowConfirm(true);
                        } }, error ? error : "Preview Proposal"))))));
};
