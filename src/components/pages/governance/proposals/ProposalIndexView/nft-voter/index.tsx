import { VoteSide } from "@tribecahq/tribeca-sdk";
import { useParams } from "react-router-dom";

import { useProposal } from "../../../../../../hooks/tribeca/useProposals";
import { ContentLoader } from "../../../../../common/ContentLoader";
import { GovernancePage } from "../../../../../common/governance/GovernancePage";
import { Profile } from "../../../../../common/governance/Profile";
import { PlaceholderSubtitle } from "../../../GovernanceOverviewView/nft-voter/ProposalsList/PlaceholderCard";
import { ProposalSubtitle } from "../../../GovernanceOverviewView/nft-voter/ProposalsList/ProposalSubtitle";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalHelmet } from "./ProposalHelmet";
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
        <div tw="grid md:grid-cols-3 gap-4">
          <VotesCard
            side={VoteSide.For}
            proposal={proposalInfo ? proposalInfo.proposalData : null}
          />
          <VotesCard
            side={VoteSide.Against}
            proposal={proposalInfo ? proposalInfo.proposalData : null}
          />
          <VotesCard
            side={VoteSide.Abstain}
            proposal={proposalInfo ? proposalInfo.proposalData : null}
          />
        </div>
        <div tw="flex flex-col md:(flex-row items-start) gap-4">
          <ProposalDetails tw="flex-1" proposalInfo={proposalInfo} />
        </div>
      </div>
    </GovernancePage>
  );
};
