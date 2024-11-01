import { useGovWindowTitle } from "../../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../../common/governance/GovernancePage";
import { MarinadeMigration } from "../../../../../common/MarinadeMigration";

export const LockerIndexView: React.FC = () => {
  useGovWindowTitle(`Locker`);
  return (
    <GovernancePage
      title="Vote Locker"
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    />
  );
};
