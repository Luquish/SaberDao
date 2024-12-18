import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { SmartWalletProvider } from "@/hooks/tribeca/useSmartWallet";
import Card from "@/components/tribeca/common/governance/Card";
import PendingTXs from "./PendingTXs";
import React from "react";

const ExecutiveCouncilTab: React.FC = () => {
  const { smartWallet } = useGovernor();
  return (
    <SmartWalletProvider initialState={smartWallet ?? undefined}>
      <div className="flex flex-col gap-4">
        <Card title="Pending Transactions">
          <PendingTXs />
        </Card>
      </div>
    </SmartWalletProvider>
  );
};

export default ExecutiveCouncilTab;
