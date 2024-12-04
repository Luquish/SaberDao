import React from "react";
import { useGovernor, useGovernorInfo } from "@/hooks/governance/useGovernor";
import { GovernanceNotFoundPage } from "@/components/governance/pages/GovernanceNotFoundPage";
import { LoadingPage } from "./LoadingPage";
import { GovernancePageInner } from "./GovernancePageInner";
import { BaseLayout } from "./BaseLayout";
import { EnvironmentProvider } from "@/hooks/governance/useEnvironment";
import { GovernorProvider } from "@/hooks/governance/useGovernor";

interface Props {
  title: React.ReactNode;
  header?: React.ReactNode;
  right?: React.ReactNode;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
  contentStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  hideDAOName?: boolean;
  backLink?: {
    label: string;
    href: string;
  };
}

const GovernancePageContent: React.FC<Props> = (props: Props) => {
  const { loading, error, governor } = useGovernor();
  
  console.log("Governance Page State:", { loading, error, governor });
  
  if (loading) {
    return <LoadingPage />;
  }

  if (error || !governor) {
    console.log("Governance Error:", error);
    return <GovernanceNotFoundPage />;
  }

  return <GovernancePageInner {...props} />;
};

export const GovernancePage: React.FC<Props> = (props: Props) => {
  return (
    <BaseLayout>
      <EnvironmentProvider>
        <GovernorProvider>
          <GovernancePageContent {...props} />
        </GovernorProvider>
      </EnvironmentProvider>
    </BaseLayout>
  );
};
