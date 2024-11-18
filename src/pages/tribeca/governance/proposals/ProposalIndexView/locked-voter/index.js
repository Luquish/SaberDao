import { ProposalState, VoteSide } from "@tribecahq/tribeca-sdk";
import { noop } from "lodash-es";
import { useLocation } from "@reach/router";
import React from "react";
import { useProposal } from "@/hooks/tribeca/useProposals";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { Profile } from "@/components/tribeca/common/governance/Profile";
import { PlaceholderSubtitle } from "../../../GovernanceOverviewView/locked-voter/ProposalsList/PlaceholderCard";
import { ProposalSubtitle } from "../../../GovernanceOverviewView/locked-voter/ProposalsList/ProposalSubtitle";
import { ProposalActivate } from "./actions/ProposalActivate";
import { ProposalExecute } from "./actions/ProposalExecute";
import { ProposalQueue } from "./actions/ProposalQueue";
import { ProposalVote } from "./actions/ProposalVote";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalHelmet } from "./ProposalHelmet";
import { ProposalHistory } from "./ProposalHistory";
import { VotesCard } from "./VotesCard";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    const proposalIndex = paths[paths.indexOf('proposals') + 1] || '';
    return { proposalIndex };
}
export const ProposalIndexView = () => {
    const location = useLocation();
    const { proposalIndex: proposalIndexStr = "" } = getParams(location.pathname);
    const { info: proposalInfo } = useProposal(parseInt(proposalIndexStr));
    return (React.createElement(GovernancePage, { title: React.createElement("h1", { className: "text-2xl md:text-3xl font-bold text-white tracking-tighter" },
            React.createElement("div", { className: "min-h-[36px] flex items-center break-words hyphens-auto" }, proposalInfo ? (proposalInfo?.proposalMetaData?.title ?? "Proposal") : (React.createElement(ContentLoader, { className: "w-40 h-7" })))), header: React.createElement("div", { className: "flex items-center gap-2 mt-2" },
            React.createElement("div", { className: "min-h-[20px]" }, proposalInfo ? (React.createElement(ProposalSubtitle, { proposalInfo: proposalInfo })) : (React.createElement(PlaceholderSubtitle, null)))), right: proposalInfo ? (React.createElement("div", { className: "bg-warmGray-850 p-3 rounded" },
            React.createElement(Profile, { address: proposalInfo.proposalData.proposer }))) : undefined },
        proposalInfo && React.createElement(ProposalHelmet, { proposalInfo: proposalInfo }),
        React.createElement("div", { className: "grid gap-4 mb-20" },
            React.createElement("div", { className: "grid md:grid-cols-2 gap-4" },
                React.createElement(VotesCard, { side: VoteSide.For, proposal: proposalInfo ? proposalInfo.proposalData : null }),
                React.createElement(VotesCard, { side: VoteSide.Against, proposal: proposalInfo ? proposalInfo.proposalData : null })),
            React.createElement("div", { className: "flex flex-col md:flex-row md:items-start gap-4" },
                React.createElement("div", { className: "flex-1 flex flex-col gap-4" },
                    React.createElement(ProposalDetails, { proposalInfo: proposalInfo })),
                React.createElement("div", { className: "w-full md:w-[350px] flex flex-col gap-4" },
                    proposalInfo?.status.state === ProposalState.Draft && proposalInfo && (React.createElement(ProposalActivate, { proposal: proposalInfo, onActivate: noop })),
                    proposalInfo?.status.state === ProposalState.Active && proposalInfo && (React.createElement(ProposalVote, { proposalInfo: proposalInfo, onVote: noop })),
                    proposalInfo?.status.state === ProposalState.Succeeded && proposalInfo && (React.createElement(ProposalQueue, { proposal: proposalInfo, onActivate: noop })),
                    proposalInfo?.status.state === ProposalState.Queued && proposalInfo && (React.createElement(ProposalExecute, { proposal: proposalInfo, onActivate: noop })),
                    React.createElement(ProposalHistory, { proposalInfo: proposalInfo }))))));
};
