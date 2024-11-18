import { Fraction } from "@saberhq/token-utils";
import { VoteSide } from "@tribecahq/tribeca-sdk";
import { BN } from "bn.js";
import React from 'react';
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Card } from "@/components/tribeca/common/governance/Card";
import { LoadingSpinner } from "@/components/tribeca/common/LoadingSpinner";
import { Meter } from "@/components/tribeca/common/Meter";
export const VOTE_SIDE_LABEL = {
    [VoteSide.For]: "For",
    [VoteSide.Against]: "Against",
    [VoteSide.Abstain]: "Abstain",
    [VoteSide.Pending]: "Pending",
};
export const VotesCard = ({ side, proposal }) => {
    const { veToken } = useGovernor();
    const voteCount = !proposal
        ? null
        : side === VoteSide.For
            ? proposal.forVotes
            : side === VoteSide.Against
                ? proposal.againstVotes
                : side === VoteSide.Abstain
                    ? proposal.abstainVotes
                    : new BN(0);
    const voteCountFmt = veToken && voteCount !== null ? (new Fraction(voteCount, 10 ** veToken.decimals).asNumber.toLocaleString(undefined, {
        maximumFractionDigits: 0,
    })) : (React.createElement(LoadingSpinner, null));
    const totalDeterminingVotes = !proposal
        ? null
        : proposal.forVotes.add(proposal.againstVotes).add(proposal.abstainVotes);
    return (React.createElement(Card, { title: React.createElement("div", { className: "flex flex-col gap-3.5 w-full" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", null, VOTE_SIDE_LABEL[side]),
                React.createElement("div", null, voteCountFmt)),
            React.createElement(Meter, { value: voteCount ?? new BN(0), max: BN.max(totalDeterminingVotes ?? new BN(0), new BN(1)), barColor: side === VoteSide.For
                    ? "var(--color-primary)"
                    : side === VoteSide.Against
                        ? "var(--color-red-500)"
                        : "var(--color-yellow-500)" })), titleClassName: "h-20" }));
};
