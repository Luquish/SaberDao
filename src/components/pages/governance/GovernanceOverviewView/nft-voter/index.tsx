import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ImageWithFallback } from "../../../../common/ImageWithFallback";
import { MarinadeMigration } from "../../../../common/MarinadeMigration";
import { RecentProposals } from "./RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { daoName, iconURL } = useGovernor();
  return (
    <GovernancePage
      title={
        <h1 tw="text-2xl md:text-3xl font-bold text-white tracking-tighter">
          <div tw="flex items-center gap-2">
            <ImageWithFallback
              src={iconURL}
              size={36}
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
