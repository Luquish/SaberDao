import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { MarinadeMigration } from "../../../../../common/MarinadeMigration";

export const ProposalCreateView: React.FC = () => {
  return (
    <GovernancePage
      title="Create a Proposal"
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    />
  );
};
