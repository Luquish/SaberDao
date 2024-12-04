import React from "react";
import { PageProps } from "gatsby";
import { GovernancePage } from "@/components/governance/common/GovernancePage";
import { GovernanceOverviewView } from "@/components/governance/pages/GovernanceOverviewView";
import { EnvironmentProvider } from "@/hooks/governance/useEnvironment";
import { GovernorProvider } from "@/hooks/governance/useGovernor";

const GovernanceIndexPage: React.FC<PageProps> = () => {
  return (
    <EnvironmentProvider>
      <GovernorProvider>
        <GovernancePage title="Governance">
          <GovernanceOverviewView />
        </GovernancePage>
      </GovernorProvider>
    </EnvironmentProvider>
  );
};

export default GovernanceIndexPage;