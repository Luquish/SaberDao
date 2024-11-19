import { ProposalState } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash-es";
import {
  FaCheck,
  FaDraftingCompass,
  FaHourglass,
  FaTimes,
} from "react-icons/fa";
import React from "react";

import type { ProposalStatus } from "@/hooks/tribeca/useProposals";

interface Props {
  status: ProposalStatus;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: "active",
  [ProposalState.Draft]: "draft",
  [ProposalState.Canceled]: "canceled",
  [ProposalState.Defeated]: "failed",
  [ProposalState.Succeeded]: "passed",
  [ProposalState.Queued]: "queued",
};

const getStateIcon = (state: ProposalState): React.ReactNode => {
  switch (state) {
    case ProposalState.Active:
      return (
        <div className="bg-accent text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaHourglass className="h-3 w-3" />
        </div>
      );
    case ProposalState.Canceled:
    case ProposalState.Defeated:
      return (
        <div className="bg-gray-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaTimes className="h-3 w-3" />
        </div>
      );
    case ProposalState.Draft:
      return (
        <div className="bg-gray-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaDraftingCompass className="h-3 w-3" />
        </div>
      );
    default:
      return (
        <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaCheck className="h-3 w-3" />
        </div>
      );
  }
};

const ProposalStateBadge: React.FC<Props> = ({ status }: Props) => {
  const { executed, state } = status;
  return (
    <div className="flex flex-col items-center gap-1 lg:(flex-row gap-5)">
      {getStateIcon(state)}
      <span className="text-xs md:text-sm text-white">
        {startCase(executed ? "executed" : STATE_LABELS[state])}
      </span>
    </div>
  );
};

export default ProposalStateBadge;
