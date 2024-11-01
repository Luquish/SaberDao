import { ProposalState, VoteSide } from "@tribecahq/tribeca-sdk";
import { noop } from "lodash-es";
import { useParams } from "react-router-dom";

import { useProposal } from "../../../../../../hooks/tribeca/useProposals";
import { ContentLoader } from "../../../../../common/ContentLoader";
import { GovernancePage } from "../../../../../common/governance/GovernancePage";
import { Profile } from "../../../../../common/governance/Profile";
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

export const ProposalIndexView: React.FC = () => {
  const { proposalIndex: proposalIndexStr = "" } = useParams<"proposalIndex">();
  const { info: proposalInfo } = useProposal(parseInt(proposalIndexStr));

  return (
    <GovernancePage
      title={
        <h1 tw="text-2xl md:text-3xl font-bold text-white tracking-tighter">
          <div tw="min-h-[36px] flex items-center break-words hyphens[auto]">
            {proposalInfo ? (
              proposalInfo?.proposalMetaData?.title ?? "Proposal"
            ) : (
              <ContentLoader tw="w-40 h-7" />
            )}
          </div>
        </h1>
      }
      header={
        <div tw="flex items-center gap-2 mt-2">
          <div tw="min-h-[20px]">
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
          <div tw="bg-warmGray-850 p-3 rounded">
            <Profile address={proposalInfo.proposalData.proposer} />
          </div>
        ) : undefined
      }
    >
      {proposalInfo && <ProposalHelmet proposalInfo={proposalInfo} />}
      <div tw="grid gap-4 mb-20">
        <div tw="grid md:grid-cols-2 gap-4">
          <VotesCard
            side={VoteSide.For}
            proposal={proposalInfo ? proposalInfo.proposalData : null}
          />
          <VotesCard
            side={VoteSide.Against}
            proposal={proposalInfo ? proposalInfo.proposalData : null}
          />
        </div>
        <div tw="flex flex-col md:(flex-row items-start) gap-4">
          <div tw="flex-1 flex flex-col gap-4">
            <ProposalDetails proposalInfo={proposalInfo} />
          </div>
          <div tw="w-full md:w-[350px] flex flex-col gap-4">
            {proposalInfo?.status.state === ProposalState.Draft && (
              <ProposalActivate proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Active && (
              <ProposalVote proposalInfo={proposalInfo} onVote={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Succeeded && (
              <ProposalQueue proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.status.state === ProposalState.Queued && (
              <ProposalExecute proposal={proposalInfo} onActivate={noop} />
            )}
            <ProposalHistory proposalInfo={proposalInfo} />
          </div>
        </div>
      </div>
    </GovernancePage>
  );
};
