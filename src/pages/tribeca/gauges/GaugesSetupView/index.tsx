import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { SetupGaugesCard } from "./SetupGaugesCard";
import React from "react";

export const GaugesSetupView: React.FC = () => {
  useGovWindowTitle(`Setup Gauges`);
  return (
    <GovernancePage title="Setup Gauges">
      <div className="flex flex-col gap-4">
        <SetupGaugesCard />
      </div>
    </GovernancePage>
  );
};

export default GaugesSetupView;
