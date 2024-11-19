import React from "react";
import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import { MarinadeMigration } from "@/components/tribeca/common/MarinadeMigration";

const LockerIndexView: React.FC = () => {
  useGovWindowTitle(`Locker`);
  return (
    <GovernancePage
      title="Vote Locker"
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    />
  );
};

export default LockerIndexView;