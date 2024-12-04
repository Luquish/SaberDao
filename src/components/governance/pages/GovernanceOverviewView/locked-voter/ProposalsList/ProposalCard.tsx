import { ProposalState } from "@tribecahq/tribeca-sdk";
import { Link } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";

import { useGovernor } from "@/hooks/governance/useGovernor";
import type { ProposalInfo } from "@/hooks/governance/useProposals";
import { PROPOSAL_TITLE_MAX_LEN } from "@/utils/governance/constants";
import { ActiveProposalVotingBars } from "./ActiveProposalVotingBars";
import { ProposalStateBadge } from "./ProposalStateBadge";
import { ProposalStateDate } from "./ProposalStateDate";
import { ProposalStateLabel } from "./ProposalStateLabel";
import { ReactComponent as PulsingDot } from "./PulsingDot.svg";

interface Props {
  proposalInfo: ProposalInfo;
}

export const ProposalCard: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { path } = useGovernor();
  const { state, executed } = proposalInfo.status;
  return (
    <Link
      to={`${path}/proposals/${proposalInfo.index}`}
      tw="flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-gray-800 cursor-pointer hover:border-l-gray-50"
    >
      <div tw="flex items-center gap-5 w-3/4 md:w-[500px]">
        {state === ProposalState.Active && (
          <PulsingDot tw="w-11 h-11 text-gray-50" />
        )}
        <div>
          <div tw="flex items-center">
            <div tw="text-white leading-snug break-words hyphens[auto]">
              {proposalInfo.proposalMetaData?.title.slice(
                0,
                PROPOSAL_TITLE_MAX_LEN
              )}
            </div>
          </div>
          {proposalInfo.proposalData && state !== null && (
            <div tw="flex flex-col mt-4 gap-2 md:(flex-row items-center mt-2)">
              <ProposalStateLabel state={state} executed={executed} />
              <div tw="flex gap-1 text-xs font-semibold">
                <span>{`000${proposalInfo.index}`.slice(-4)}</span>
                <span>&middot;</span>
                <ProposalStateDate proposalInfo={proposalInfo} />
              </div>
            </div>
          )}
        </div>
      </div>
      {state === ProposalState.Active && (
        <div tw="w-[290px]">
          <ActiveProposalVotingBars proposal={proposalInfo} />
        </div>
      )}
      {state !== null &&
        state !== ProposalState.Draft &&
        state !== ProposalState.Active && (
          <ProposalBadgeWrapper>
            <ProposalStateBadge status={proposalInfo.status} />
          </ProposalBadgeWrapper>
        )}
    </Link>
  );
};

export const ProposalBadgeWrapper = styled.div`
  ${tw`w-16 md:w-20 lg:w-[140px]`}
`;
