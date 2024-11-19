import { ProposalState } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash-es";
import React from 'react';

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

const ProposalStateLabel: React.FC<Props> = ({
  state,
  executed,
}: Props) => {
  const getStateClasses = () => {
    const baseClasses = "text-xs border rounded py-0.5 w-16 flex items-center justify-center";
    
    if (state === ProposalState.Canceled || 
        state === ProposalState.Defeated || 
        state === ProposalState.Draft) {
      return `${baseClasses} border-gray-500 text-gray-500`;
    }
    
    if (executed || 
        state === ProposalState.Succeeded || 
        state === ProposalState.Queued) {
      return `${baseClasses} border-primary text-primary`;
    }
    
    if (state === ProposalState.Active) {
      return `${baseClasses} border-accent text-accent`;
    }

    return baseClasses;
  };

  return (
    <div className={getStateClasses()}>
      {startCase(executed ? "executed" : STATE_LABELS[state])}
    </div>
  );
};

export default ProposalStateLabel;