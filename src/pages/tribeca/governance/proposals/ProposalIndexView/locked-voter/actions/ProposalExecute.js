import { useTXHandlers } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import { TransactionInstruction } from "@solana/web3.js";
import pluralize from "pluralize";
import Countdown from "react-countdown";
import { Link } from "gatsby";
import React from "react";
import invariant from "tiny-invariant";
import { useSDK } from "@/contexts/sdk";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { useGokiTransactionData } from "@/utils/tribeca/parsers";
import { gokiTXLink, tsToDate } from "@/utils/tribeca/utils";
import { AsyncConfirmButton } from "@/components/tribeca/common/AsyncConfirmButton";
import { Card } from "@/components/tribeca/common/governance/Card";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
import { ExecuteProposalButton } from "../../../../GovernanceManageView/tabs/ExecutiveCouncilTab/ExecuteProposalButton";
import { EmbedTX } from "../EmbedTX";
export const ProposalExecute = ({ proposal, onActivate, }) => {
    const { governorW, smartWallet, path, manifest } = useGovernor();
    const emergencyDAO = manifest?.addresses?.["emergency-dao"]?.address;
    const { sdkMut } = useSDK();
    const { wrapTx } = useWrapTx();
    const { ecWallet, isMemberOfEC } = useExecutiveCouncil();
    const { data: gokiTransactionData } = useGokiTransactionData(proposal.proposalData.queuedTransaction);
    const { signAndConfirmTX } = useTXHandlers();
    if (!gokiTransactionData) {
        return React.createElement(React.Fragment, null);
    }
    const votingEndedAt = tsToDate(proposal.proposalData.queuedAt);
    const eta = tsToDate(gokiTransactionData.account.eta);
    const gracePeriodEnd = mapSome(ecWallet.data, (d) => !gokiTransactionData.account.eta.isNeg()
        ? tsToDate(gokiTransactionData.account.eta.add(d.account.gracePeriod))
        : null);
    const etaSurpassed = eta <= new Date();
    const gracePeriodSurpassed = mapSome(gracePeriodEnd, (g) => g <= new Date());
    return (React.createElement(Card, { title: "Execute Proposal" },
        React.createElement("div", { className: "px-7 py-4 text-sm" },
            React.createElement(ProseSmall, null,
                React.createElement("p", { className: "mb-4" },
                    "The proposal was queued on",
                    " ",
                    React.createElement("span", { className: "text-white" }, votingEndedAt.toLocaleString(undefined, {
                        timeZoneName: "short",
                    })),
                    "."),
                gracePeriodSurpassed ? (React.createElement("p", null,
                    "The proposal execution period expired on",
                    " ",
                    gracePeriodEnd?.toLocaleString(undefined, {
                        timeZoneName: "short",
                    }),
                    ". This proposal may no longer be executed by the Executive Council.")) : etaSurpassed ? (React.createElement("p", null,
                    "It may now be executed by any member of the",
                    " ",
                    React.createElement(Link, { to: `/tribeca${path}/details`, className: "text-primary hover:text-white transition-colors" }, "Executive Council"),
                    " ",
                    "at any time before",
                    " ",
                    gracePeriodEnd?.toLocaleString(undefined, {
                        timeZoneName: "short",
                    }),
                    ".")) : (React.createElement("p", null,
                    "It may be executed by any member of the",
                    " ",
                    React.createElement(Link, { to: `/tribeca${path}/details`, className: "text-primary hover:text-white transition-colors" }, "Executive Council"),
                    " ",
                    "in",
                    " ",
                    React.createElement(Countdown, { date: eta }),
                    ".")),
                React.createElement(ExternalLink, { className: "mb-4", href: gokiTXLink(gokiTransactionData.account) }, "View on Goki")),
            isMemberOfEC && (React.createElement("div", { className: "flex justify-center items-center mt-8" },
                gracePeriodSurpassed && emergencyDAO && (React.createElement(AsyncConfirmButton, { modal: {
                        title: "Revive Proposal via Emergency DAO",
                        contents: (React.createElement("div", { className: "prose prose-light prose-sm" },
                            React.createElement("p", null,
                                "You are about to propose the following",
                                " ",
                                pluralize("instruction", gokiTransactionData.account.instructions.length),
                                " ",
                                "on behalf of the emergency DAO:"),
                            React.createElement("div", null,
                                React.createElement(EmbedTX, { txKey: gokiTransactionData.publicKey })))),
                    }, disabled: !governorW || !ecWallet.data || !etaSurpassed, className: "w-3/4", variant: "primary", onClick: async () => {
                        invariant(governorW && sdkMut && smartWallet && ecWallet.data);
                        const daoWallet = await sdkMut.loadSmartWallet(smartWallet);
                        const emergencyDAOWallet = await sdkMut.loadSmartWallet(emergencyDAO);
                        const { tx: innerTx } = await daoWallet.newTransaction({
                            proposer: emergencyDAOWallet.key,
                            instructions: proposal.proposalData.instructions.map((ix) => new TransactionInstruction({
                                ...ix,
                                data: Buffer.from(ix.data)
                            })),
                        });
                        const { tx } = await emergencyDAOWallet.newTransaction({
                            instructions: innerTx.instructions,
                        });
                        invariant(tx.instructions[0]);
                        await signAndConfirmTX(await wrapTx(tx), `Revive Proposal`);
                    } }, !etaSurpassed ? (React.createElement(React.Fragment, null,
                    React.createElement("span", { className: "mr-1" }, "ETA in"),
                    React.createElement(Countdown, { date: eta }))) : ("Revive Proposal via Emergency DAO"))),
                React.createElement(ExecuteProposalButton, { tx: gokiTransactionData, onActivate: onActivate }))))));
};
