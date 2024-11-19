import { VoteSide } from "@tribecahq/tribeca-sdk";
import React from 'react';

import type { ProposalInfo } from "@/hooks/tribeca/useProposals";
import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import CastVoteModal from "./CastVoteModal";

interface Props {
  proposalInfo: ProposalInfo;
  side: VoteSide | null;
}

const CastVoteButton: React.FC<Props> = ({
  proposalInfo,
  side,
}: Props) => {
  return (
    <ModalButton
      className="max-w-md"
      buttonProps={{
        variant: "outline",
        className: "border-white w-2/5 hover:border-primary hover:bg-primary hover:bg-opacity-20",
      }}
      buttonLabel={
        side === null // Vote account not yet created
          ? "Cast Vote"
          : side === VoteSide.Pending
          ? "Cast Vote"
          : "Change Vote"
      }
    >
      <CastVoteModal proposalInfo={proposalInfo} />
    </ModalButton>
  );
};

export default CastVoteButton;