import {
  useGovernor,
  useGovWindowTitle
} from "@/hooks/governance/useGovernor";
import { EnvironmentProvider } from "@/hooks/governance/useEnvironment";

import { GovernancePage } from "@/components/governance/common/GovernancePage";
import { MarinadeMigration } from "@/components/governance/common/MarinadeMigration";
import { RecentProposals } from "../RecentProposals";

const GovernanceContent: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { daoName, iconURL } = useGovernor();
  return (
    <GovernancePage
      title={
        <h1 tw="text-2xl md:text-3xl font-bold text-white tracking-tighter">
          <div tw="flex items-center gap-2">
            <img
              src={iconURL}
              alt={`Icon for ${daoName ?? "DAO"}`}
            />
            <span>{daoName} Governance</span>
          </div>
        </h1>
      }
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    >
      <RecentProposals />
    </GovernancePage>
  );
};

export const GovernanceOverviewView: React.FC = () => {
  return (
    <EnvironmentProvider>
      <GovernanceContent />
    </EnvironmentProvider>
  );
};
