import React from "react";

import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import { MarinadeMigration } from "@/components/tribeca/common/MarinadeMigration";

const GovernanceDetailsView: React.FC = () => {
  useGovWindowTitle(`Details`);
  return (
    <GovernancePage
      title="Governance Details"
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    />
  );
};

export default GovernanceDetailsView;
