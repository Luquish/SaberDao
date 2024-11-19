import { ProposalState, VoteSide } from "@tribecahq/tribeca-sdk";
import { noop } from "lodash-es";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useProposal } from "@/hooks/tribeca/useProposals";
import ContentLoader from "@/components/tribeca/common/ContentLoader";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import Profile from "@/components/tribeca/common/governance/Profile";
import { PlaceholderSubtitle } from "@/pages/tribeca/GovernanceOverviewView/locked-voter/ProposalsList/PlaceholderCard";
import ProposalSubtitle from "@/pages/tribeca/GovernanceOverviewView/locked-voter/ProposalsList/ProposalSubtitle";
import ProposalActivate from "./actions/ProposalActivate";
import ProposalExecute from "./actions/ProposalExecute";
import ProposalQueue from "./actions/ProposalQueue";
import ProposalVote from "./actions/ProposalVote";
import ProposalDetails from "./ProposalDetails";
import ProposalHelmet from "./ProposalHelmet";
import ProposalHistory from "./ProposalHistory";
import VotesCard from "./VotesCard";
import { getUrlParams } from "@/utils/tribeca/urlParams";

const ProposalIndexView: React.FC = () => {
  const location = useLocation();
  const proposalIndexStr = getUrlParams.proposal(location.pathname);
  const { info: proposalInfo } = useProposal(parseInt(proposalIndexStr));

  return (
    <GovernancePage
      title={
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
          <div className="min-h-[36px] flex items-center break-words hyphens-auto">
            {proposalInfo ? (
              proposalInfo?.proposalMetaData?.title ?? "Proposal"
            ) : (
              <ContentLoader className="w-40 h-7" />
            )}
          </div>
        </h1>
      }
      header={
        <div className="flex items-center gap-2 mt-2">
          <div className="min-h-[20px]">
            {proposalInfo ? (
              <ProposalSubtitle proposalInfo={proposalInfo} />
            ) : (
              <PlaceholderSubtitle />
            )}
          </div>
        </div>
      }
      right={
        proposalInfo ? (
          <div className="bg-warmGray-850 p-3 rounded">
            <Profile address={proposalInfo.proposalData.proposer} />
          </div>
        ) : undefined
      }
    >
      {proposalInfo && <ProposalHelmet proposalInfo={proposalInfo} />}
      <div className="grid gap-4 mb-20">
        <div className="grid md:grid-cols-2 gap-4">
          <VotesCard
            side={VoteSide.For}
            proposal={proposalInfo ? proposalInfo.proposalData : null}
          />
          <VotesCard
            side={VoteSide.Against}
            proposal={proposalInfo ? proposalInfo.proposalData : null}
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <ProposalDetails proposalInfo={proposalInfo} />
          </div>
          <div className="w-full md:w-[350px] flex flex-col gap-4">
            {proposalInfo?.status.state === ProposalState.Draft && proposalInfo && (
              <ProposalActivate proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Active && proposalInfo && (
              <ProposalVote proposalInfo={proposalInfo} onVote={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Succeeded && proposalInfo && (
              <ProposalQueue proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Queued && proposalInfo && (
              <ProposalExecute proposal={proposalInfo} onActivate={noop} />
            )}
            <ProposalHistory proposalInfo={proposalInfo} />
          </div>
        </div>
      </div>
    </GovernancePage>
  );
};

export default ProposalIndexView;
