import React from "react";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Card } from "@/components/tribeca/common/governance/Card";
import { ProposalsList } from "./ProposalsList";

export const RecentProposals: React.FC = () => {
  const { path } = useGovernor();
  return (
    <Card
      title="Recent Proposals"
      link={{
        title: "View all proposals",
        href: `${path}/proposals`,
      }}
    >
      <ProposalsList maxCount={3} />
    </Card>
  );
};
