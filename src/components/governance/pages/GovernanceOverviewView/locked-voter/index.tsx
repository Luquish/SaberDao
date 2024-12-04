import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/governance/useGovernor";
import { Card } from "@/components/governance/common/Card";
import { GovernancePage } from "@/components/governance/common/GovernancePage";
import { ImageWithFallback } from "@/components/governance/common/ImageWithFallback";
import { ProgramsList } from "@/components/governance/pages/ProgramsView/ProgramsList";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "@/components/governance/pages/GovernanceOverviewView/RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { daoName, iconURL, path } = useGovernor();
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
      preContent={<OverviewHeader />}
      hideDAOName={true}
    >
      <RecentProposals />
      <Card
        tw="mt-8"
        title="Programs"
        link={{
          title: "View all programs",
          href: `${path}/programs`,
        }}
      >
        <ProgramsList maxCount={3} />
      </Card>
    </GovernancePage>
  );
};
