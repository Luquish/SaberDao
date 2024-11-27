import { ProposalState } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash-es";
import {
  FaCheck,
  FaDraftingCompass,
  FaHourglass,
  FaTimes,
} from "react-icons/fa";

import type { ProposalStatus } from "@/hooks/governance/useProposals";

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
        <div tw="bg-accent text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaHourglass tw="h-3 w-3" />
        </div>
      );
    case ProposalState.Canceled:
    case ProposalState.Defeated:
      return (
        <div tw="bg-gray-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaTimes tw="h-3 w-3" />
        </div>
      );
    case ProposalState.Draft:
      return (
        <div tw="bg-gray-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaDraftingCompass tw="h-3 w-3" />
        </div>
      );
    default:
      return (
        <div tw="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center">
          <FaCheck tw="h-3 w-3" />
        </div>
      );
  }
};

export const ProposalStateBadge: React.FC<Props> = ({ status }: Props) => {
  const { executed, state } = status;
  return (
    <div tw="flex flex-col items-center gap-1 lg:(flex-row gap-5)">
      {getStateIcon(state)}
      <span tw="text-xs md:text-sm text-white">
        {startCase(executed ? "executed" : STATE_LABELS[state])}
      </span>
    </div>
  );
};
