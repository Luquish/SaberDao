import { useGovWindowTitle } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { MarinadeMigration } from "../../../../common/MarinadeMigration";

export const GovernanceDetailsView: React.FC = () => {
  useGovWindowTitle(`Details`);
  return (
    <GovernancePage
      title="Governance Details"
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    />
  );
};
