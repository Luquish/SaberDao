import { ProposalState } from "@tribecahq/tribeca-sdk";
import React from "react";

import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { ProposalStateLabel } from "./ProposalStateLabel";

export const PlaceholderCard: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary">
      <div>
        <div className="h-5 flex items-center">
          <ContentLoader className="h-3 rounded" />
        </div>
        <PlaceholderSubtitle />
      </div>
    </div>
  );
};

export const PlaceholderSubtitle: React.FC = () => (
  <div className="flex items-center gap-2 mt-2">
    <ProposalStateLabel state={ProposalState.Draft} />
    <div className="flex items-center gap-1">
      <ContentLoader className="h-2 w-4" />
      <span>&middot;</span>
      <ContentLoader className="h-2 w-20" />
    </div>
  </div>
);
