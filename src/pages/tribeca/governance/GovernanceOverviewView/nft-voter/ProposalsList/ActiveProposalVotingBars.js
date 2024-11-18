import { BN } from "bn.js";
import React from 'react';
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { formatNumberSI } from "@/utils/tribeca/format";
import { LoadingSpinner } from "@/components/tribeca/common/LoadingSpinner";
import { Meter } from "@/components/tribeca/common/Meter";
export const ActiveProposalVotingBars = ({ proposal, }) => {
    const { veToken } = useGovernor();
    if (!veToken) {
        return React.createElement(LoadingSpinner, null);
    }
    const forVotes = proposal.proposalData.forVotes
        .div(new BN(10 ** veToken.decimals))
        .toNumber();
    const againstVotes = proposal.proposalData.againstVotes
        .div(new BN(10 ** veToken.decimals))
        .toNumber();
    const maxVotes = Math.max(forVotes, againstVotes, 1);
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("div", { className: "w-full flex items-center gap-3 text-xs text-white font-medium h-6" },
            React.createElement(Meter, { value: forVotes, max: maxVotes, barColor: "var(--color-primary)" }),
            React.createElement("div", { className: "basis-[44px]" }, formatNumberSI(forVotes))),
        React.createElement("div", { className: "w-full flex items-center gap-3 text-xs text-white font-medium h-6" },
            React.createElement(Meter, { value: againstVotes, max: maxVotes, barColor: "var(--color-red-500)" }),
            React.createElement("div", { className: "basis-[44px]" }, formatNumberSI(againstVotes)))));
};
