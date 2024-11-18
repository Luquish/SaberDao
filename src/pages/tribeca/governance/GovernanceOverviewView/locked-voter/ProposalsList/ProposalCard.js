import { ProposalState } from "@tribecahq/tribeca-sdk";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { PROPOSAL_TITLE_MAX_LEN } from "@/utils/tribeca/constants";
import { ActiveProposalVotingBars } from "./ActiveProposalVotingBars";
import { ProposalStateBadge } from "./ProposalStateBadge";
import { ProposalStateDate } from "./ProposalStateDate";
import { ProposalStateLabel } from "./ProposalStateLabel";
import { ReactComponent as PulsingDot } from "./PulsingDot.svg";
export const ProposalCard = ({ proposalInfo }) => {
    const { path } = useGovernor();
    const { state, executed } = proposalInfo.status;
    return (React.createElement(Link, { to: `/tribeca${path}/proposals/${proposalInfo.index}`, className: clsx("flex items-center justify-between py-5 px-6", "border-l-2 border-l-transparent border-b border-b-warmGray-800", "cursor-pointer hover:border-l-primary") },
        React.createElement("div", { className: "flex items-center gap-5 w-3/4 md:w-[500px]" },
            state === ProposalState.Active && (React.createElement(PulsingDot, { className: "w-11 h-11 text-accent" })),
            React.createElement("div", null,
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("div", { className: "text-white leading-snug break-words hyphens-auto" }, proposalInfo.proposalMetaData?.title.slice(0, PROPOSAL_TITLE_MAX_LEN))),
                proposalInfo.proposalData && state !== null && (React.createElement("div", { className: "flex flex-col mt-4 gap-2 md:flex-row md:items-center md:mt-2" },
                    React.createElement(ProposalStateLabel, { state: state, executed: executed }),
                    React.createElement("div", { className: "flex gap-1 text-xs font-semibold" },
                        React.createElement("span", null, `000${proposalInfo.index}`.slice(-4)),
                        React.createElement("span", null, "\u00B7"),
                        React.createElement(ProposalStateDate, { proposalInfo: proposalInfo })))))),
        state === ProposalState.Active && (React.createElement("div", { className: "w-[290px]" },
            React.createElement(ActiveProposalVotingBars, { proposal: proposalInfo }))),
        state !== null &&
            state !== ProposalState.Draft &&
            state !== ProposalState.Active && (React.createElement("div", { className: "w-16 md:w-20 lg:w-[140px]" },
            React.createElement(ProposalStateBadge, { status: proposalInfo.status })))));
};
