import React from "react";
import {
  useGovernorInfo,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { InitializeGovernanceCard } from "./InitializeGovernanceCard";
import { OnboardingChecklist } from "./OnboardingChecklist";

export const GovernanceSetupView: React.FC = () => {
  const info = useGovernorInfo();
  useGovWindowTitle(`Setup`);
  return (
    <GovernancePage title="Initialize Governance">
      <div className="flex flex-col gap-4">
        {info ? <InitializeGovernanceCard info={info} /> : <LoadingPage />}
        <OnboardingChecklist />
      </div>
    </GovernancePage>
  );
};

export default GovernanceSetupView;
