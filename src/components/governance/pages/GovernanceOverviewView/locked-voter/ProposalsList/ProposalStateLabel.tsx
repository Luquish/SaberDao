import { ProposalState } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash-es";

interface Props {
  state: ProposalState;
  executed?: boolean;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: "active",
  [ProposalState.Draft]: "draft",
  [ProposalState.Canceled]: "canceled",
  [ProposalState.Defeated]: "failed",
  [ProposalState.Succeeded]: "passed",
  [ProposalState.Queued]: "queued",
};

export const ProposalStateLabel: React.FC<Props> = ({
  state,
  executed,
}: Props) => {
  const baseClasses = "text-xs border rounded py-0.5 w-16 flex items-center justify-center";
  
  const stateClasses = {
    [ProposalState.Canceled]: "border-gray-500 text-gray-500",
    [ProposalState.Defeated]: "border-gray-500 text-gray-500",
    [ProposalState.Draft]: "border-gray-500 text-gray-500",
    [ProposalState.Succeeded]: "border-gray-50 text-gray-50",
    [ProposalState.Queued]: "border-gray-50 text-gray-50",
    [ProposalState.Active]: "border-gray-50 text-gray-50",
  };

  const classes = `${baseClasses} ${stateClasses[state]} ${executed ? "border-gray-50 text-gray-50" : ""}`;

  return (
    <div className={classes}>
      {startCase(executed ? "executed" : STATE_LABELS[state])}
    </div>
  );
};
