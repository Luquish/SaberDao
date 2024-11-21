import React from "react";
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

const getStateClassName = (state: ProposalState, executed?: boolean): string => {
  if (executed) return "state-label state-label--accent";
  switch (state) {
    case ProposalState.Active:
      return "state-label state-label--primary";
    case ProposalState.Succeeded:
      return "state-label state-label--accent";
    default:
      return "state-label state-label--gray";
  }
};

export const ProposalStateLabel: React.FC<Props> = ({
  state,
  executed,
}: Props) => {
  return (
    <>
      <style>
        {`
          .state-label {
            font-size: 0.75rem;
            border: 1px solid;
            border-radius: 0.25rem;
            padding: 0.125rem 0;
            width: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .state-label--gray {
            border-color: #6B7280;
            color: #6B7280;
          }

          .state-label--primary {
            border-color: #1a73e8;
            color: #1a73e8;
          }

          .state-label--accent {
            border-color: #f59e0b;
            color: #f59e0b;
          }
        `}
      </style>
      <div className={getStateClassName(state, executed)}>
        {startCase(executed ? "executed" : STATE_LABELS[state])}
      </div>
    </>
  );
};
