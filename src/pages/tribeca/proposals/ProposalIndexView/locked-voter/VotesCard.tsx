import { Fraction } from "@saberhq/token-utils";
import type { ProposalData } from "@tribecahq/tribeca-sdk";
import { VoteSide } from "@tribecahq/tribeca-sdk";
import { BN } from "bn.js";
import React from 'react';

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import Card from "@/components/tribeca/common/governance/Card";
import LoadingSpinner from "@/components/tribeca/common/LoadingSpinner";
import { Meter } from "@/components/tribeca/common/Meter";

export const VOTE_SIDE_LABEL = {
  [VoteSide.For]: "For",
  [VoteSide.Against]: "Against",
  [VoteSide.Abstain]: "Abstain",
  [VoteSide.Pending]: "Pending",
} as const;

interface Props {
  side: VoteSide.For | VoteSide.Against;
  proposal: ProposalData | null;
}

const VotesCard: React.FC<Props> = ({ side, proposal }: Props) => {
  const { veToken } = useGovernor();
  const voteCount = !proposal
    ? null
    : side === VoteSide.For
    ? proposal.forVotes
    : side === VoteSide.Against
    ? proposal.againstVotes
    : new BN(0);

  const voteCountFmt =
    veToken && voteCount !== null ? (
      new Fraction(voteCount, 10 ** veToken.decimals).asNumber.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      )
    ) : (
      <LoadingSpinner />
    );

  const totalDeterminingVotes = !proposal
    ? null
    : proposal.forVotes.add(proposal.againstVotes);

  return (
    <Card
      title={
        <div className="flex flex-col gap-3.5 w-full">
          <div className="flex items-center justify-between">
            <div>{VOTE_SIDE_LABEL[side]}</div>
            <div>{voteCountFmt}</div>
          </div>
          <Meter
            value={voteCount ?? new BN(0)}
            max={BN.max(totalDeterminingVotes ?? new BN(0), new BN(1))}
            barColor={
              side === VoteSide.For
                ? "var(--color-primary)"
                : "var(--color-red-500)"
            }
          />
        </div>
      }
      titleClassName="h-20"
      // link={{
      //   title: "View All",
      //   href: "",
      // }}
    />
  );
};

export default VotesCard;
