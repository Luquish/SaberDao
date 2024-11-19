import React from "react";

import {
  GovernorProvider,
  useGovernorInfo,
} from "@/hooks/tribeca/useGovernor";
import { EmptyState } from "@/components/tribeca/common/EmptyState";
import Card from "@/components/tribeca/common/governance/Card";
import GaugeForemanEC from "./GaugeForemanEC";

const OnboardingChecklist: React.FC = () => {
  const info = useGovernorInfo();

  if (!info) {
    return (
      <Card title="Integration Status">
        <EmptyState title="Your DAO is not yet set up." />
      </Card>
    );
  }

  return (
    <GovernorProvider>
      <Card title="Integration Status">
        <GaugeForemanEC />
      </Card>
    </GovernorProvider>
  );
};

export default OnboardingChecklist;