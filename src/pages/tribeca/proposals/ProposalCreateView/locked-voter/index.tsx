import React from 'react';

import { useSDK } from "@/contexts/sdk";
import { EmptyStateConnectWallet } from "@/components/tribeca/common/EmptyState";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { ProposalCreateInner } from "./ProposalCreateInner";

export const ProposalCreateView: React.FC = () => {
  const { sdkMut } = useSDK();
  return (
    <GovernancePage
      title="Create a Proposal"
      containerClassName="w-11/12 md:w-full max-w-7xl mx-auto"
    >
      {sdkMut ? (
        <ProposalCreateInner />
      ) : (
        <Card title="Proposal Info">
          <EmptyStateConnectWallet />
        </Card>
      )}
    </GovernancePage>
  );
};
