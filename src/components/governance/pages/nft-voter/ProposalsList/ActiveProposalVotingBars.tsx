import React from "react";
import { BN } from "bn.js";
import { theme } from "twin.macro";

import { useGovernor } from "@/src/hooks/governance/useGovernor";
import type { ProposalInfo } from "@/src/hooks/governance/useProposals";
import { formatNumberSI } from "@/src/utils/governance/format";
import { LoadingSpinner } from "@/src/components/governance/LoadingSpinner";
import { Meter } from "@/src/components/governance/Meter";

interface Props {
  proposal: ProposalInfo;
}

export const ActiveProposalVotingBars: React.FC<Props> = ({
  proposal,
}: Props) => {
  const { veToken } = useGovernor();
  if (!veToken) {
    return <LoadingSpinner />;
  }
  const forVotes = proposal.proposalData.forVotes
    .div(new BN(10 ** veToken.decimals))
    .toNumber();
  const againstVotes = proposal.proposalData.againstVotes
    .div(new BN(10 ** veToken.decimals))
    .toNumber();
  const maxVotes = Math.max(forVotes, againstVotes, 1);
  return (
    <div tw="flex flex-col">
      <div tw="w-full flex items-center gap-3 text-xs text-white font-medium h-6">
        <Meter
          value={forVotes}
          max={maxVotes}
          barColor={theme`colors.green.500`}
        />
        <div>{formatNumberSI(forVotes)}</div>
      </div>
      <div tw="w-full flex items-center gap-3 text-xs text-white font-medium h-6">
        <Meter
          value={againstVotes}
          max={maxVotes}
          barColor={theme`colors.red.500`}
        />
        <div>{formatNumberSI(againstVotes)}</div>
      </div>
    </div>
  );
};
