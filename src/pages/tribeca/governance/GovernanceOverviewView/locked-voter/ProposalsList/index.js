import { ProposalState } from "@tribecahq/tribeca-sdk";
import { useState } from "react";
import { Link } from "gatsby";
import React from "react";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useProposals } from "@/hooks/tribeca/useProposals";
import { EmptyState } from "@/components/tribeca/common/EmptyState";
import { PageNav } from "./PageNav";
import { PlaceholderCard } from "./PlaceholderCard";
import { ProposalCard } from "./ProposalCard";
const NUM_PLACEHOLDERS = 0;
const PROPOSALS_PER_PAGE = 20;
export const ProposalsList = ({ maxCount = 9_999_999, showDrafts = false, }) => {
    const { path, proposalCount } = useGovernor();
    const proposals = useProposals();
    const [currentPage, setCurrentPage] = useState(0);
    const allProposals = [
        ...proposals,
        ...new Array(NUM_PLACEHOLDERS).fill(null),
    ]
        .filter((p) => {
        const proposalState = p?.data?.status.state;
        return showDrafts
            ? true
            : proposalState !== ProposalState.Draft &&
                proposalState !== ProposalState.Canceled;
    })
        .slice(0, maxCount);
    const startCursor = currentPage * PROPOSALS_PER_PAGE;
    if (typeof proposalCount !== "number") {
        return (React.createElement(React.Fragment, null, Array(Math.min(PROPOSALS_PER_PAGE, maxCount))
            .fill(null)
            .map((_, i) => (React.createElement(PlaceholderCard, { key: i })))));
    }
    if (proposalCount === 0 || allProposals.length === 0) {
        return (React.createElement("div", null,
            React.createElement(EmptyState, { title: "There aren't any proposals yet." },
                React.createElement(Link, { className: "text-primary hover:text-white transition-colors", to: `/tribeca${path}/proposals/create` }, "Create a proposal"))));
    }
    const pageCount = calcPageTotal(allProposals.length ?? 0);
    return (React.createElement(React.Fragment, null,
        allProposals
            .slice(startCursor, startCursor + PROPOSALS_PER_PAGE)
            .map((proposal, i) => proposal && proposal.data ? (React.createElement(ProposalCard, { key: proposal.data.proposalKey.toString(), proposalInfo: proposal.data })) : (React.createElement(PlaceholderCard, { key: i }))),
        pageCount > 1 && (React.createElement(PageNav, { currentPage: currentPage, setCurrentPage: setCurrentPage, numPages: pageCount }))));
};
const calcPageTotal = (numProposals) => {
    const div = Math.floor(numProposals / PROPOSALS_PER_PAGE);
    return div + (numProposals % PROPOSALS_PER_PAGE ? 1 : 0);
};
