import { VoteSide } from "@tribecahq/tribeca-sdk";
import React from "react";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import type { ProposalInfo } from "@/hooks/tribeca/useProposals";
import { Button } from "@/components/tribeca/common/Button";
import { ModalInner } from "@/components/tribeca/common/Modal/ModalInner";
import { VOTE_SIDE_LABEL } from "@/pages/tribeca/proposals/ProposalIndexView/locked-voter/VotesCard";

interface Props {
  proposalInfo: ProposalInfo;
  side: VoteSide;
  reason: string | null;
}

const formatTweet = ({
  daoName,
  proposal,
  side,
  reason,
}: {
  daoName: string;
  proposal: ProposalInfo;
  side: VoteSide;
  reason: string | null;
}) =>
  [
    `I ${
      side !== VoteSide.Abstain
        ? `voted ${VOTE_SIDE_LABEL[side].toLowerCase()}`
        : `abstained from voting on`
    } ${daoName} Proposal #${proposal.index}${
      proposal.proposalMetaData?.title
        ? `: ${proposal.proposalMetaData.title}`
        : ""
    }`,
    reason,
    `Vote here: ${window.location.href}`,
  ]
    .filter((s) => !!s)
    .join("\n\n");

const VoteResult: React.FC<Props> = ({
  proposalInfo,
  side,
  reason,
}: Props) => {
  const { daoName } = useGovernor();
  return (
    <ModalInner title="Vote Confirmed" className="px-6 max-w-md">
      <div className="flex flex-col items-center">
        <div className="text-center max-w-sm flex flex-col items-center gap-3">
          <h2 className="text-white font-semibold text-xl leading-loose">
            You{" "}
            {side !== VoteSide.Abstain
              ? `voted ${VOTE_SIDE_LABEL[side].toLowerCase()}`
              : `abstained from voting on`}
            <br />
            {proposalInfo.proposalMetaData?.title ??
              `Proposal #${proposalInfo.index}`}
          </h2>
          <p className="text-sm leading-loose text-warmGray-400">
            Help spread the word for your
            <br />
            choice to win the vote:
          </p>
        </div>
        <div className="mt-8">
          {daoName && (
            <a
              target="_blank"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                formatTweet({
                  daoName,
                  proposal: proposalInfo,
                  side,
                  reason,
                })
              )}`}
              rel="noreferrer"
            >
              <Button variant="primary" size="md">
                Tweet your {side === VoteSide.For ? "support" : "stance"}
              </Button>
            </a>
          )}
        </div>
      </div>
    </ModalInner>
  );
};

export default VoteResult;
