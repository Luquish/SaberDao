import { TokenAmount } from "@saberhq/token-utils";
import { VOTE_SIDE_LABELS } from "@tribecahq/tribeca-sdk";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import { useSDK } from "@/contexts/sdk";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useVote } from "@/hooks/tribeca/useVote";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { MouseoverTooltip } from "@/components/tribeca/common/MouseoverTooltip";
import { WalletButton } from "@/components/tribeca/layout/GovernorLayout/Header/WalletButton";
import { sideColor } from "../../../../utils/voting";
import { CastVoteButton } from "../CastVoteButton";
export const ProposalVote = ({ proposalInfo }) => {
    const { veToken, path } = useGovernor();
    const { sdkMut } = useSDK();
    const { data: escrow, veBalance } = useUserEscrow();
    const { data: vote } = useVote(proposalInfo.proposalKey, sdkMut?.provider.wallet.publicKey);
    const vePower = veToken && escrow
        ? new TokenAmount(veToken, escrow.calculateVotingPower(proposalInfo.proposalData.votingEndsAt.toNumber()))
        : null;
    const lockupTooShort = escrow &&
        escrow.escrow.escrowEndsAt.lt(proposalInfo.proposalData.votingEndsAt);
    return (React.createElement(Card, { title: React.createElement("div", { className: "flex" },
            React.createElement("span", null, "Vote"),
            lockupTooShort && (React.createElement(MouseoverTooltip, { text: React.createElement("div", { className: "max-w-sm" },
                    React.createElement("p", null, "Your voting escrow expires before the period which voting ends. Please extend your lockup to cast your vote.")), placement: "bottom-start" },
                React.createElement(FaExclamationTriangle, { className: "h-4 cursor-pointer inline-block align-middle mx-2 mb-0.5 text-yellow-500" })))) },
        React.createElement("div", { className: "py-8" },
            React.createElement("div", { className: "flex flex-col items-center gap-4" }, !sdkMut ? (React.createElement(WalletButton, null)) : !veBalance ? (React.createElement("div", { className: "text-sm px-8 text-center" },
                React.createElement("p", null, "You must lock tokens in order to vote on this proposal."),
                React.createElement(Link, { className: "flex justify-center items-center", to: `/tribeca${path}/locker` },
                    React.createElement(Button, { variant: "outline", className: "border-white hover:border-primary hover:bg-primary hover:bg-opacity-20 mt-4" }, "Lock Tokens")))) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "flex flex-col items-center gap-1" },
                    React.createElement("span", { className: "text-sm font-medium" }, "Voting Power"),
                    React.createElement("span", { className: "text-white font-semibold text-lg" }, vePower?.formatUnits())),
                vote && (React.createElement("div", { className: "flex flex-col items-center gap-1" },
                    React.createElement("span", { className: "text-sm font-medium" }, "You Voted"),
                    React.createElement("span", { className: "text-white font-semibold text-lg", style: vote
                            ? {
                                color: sideColor(vote.accountInfo.data.side),
                            }
                            : {} }, VOTE_SIDE_LABELS[vote.accountInfo.data.side]))),
                React.createElement("div", { className: "flex w-full items-center justify-center" },
                    React.createElement(CastVoteButton, { proposalInfo: proposalInfo, side: vote ? vote.accountInfo.data.side : null }))))))));
};
