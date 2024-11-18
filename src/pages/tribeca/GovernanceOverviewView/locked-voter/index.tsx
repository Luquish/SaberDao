import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { ImageWithFallback } from "@/components/tribeca/common/ImageWithFallback";
import { ProgramsList } from "../../ProgramsView/ProgramsList";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "./RecentProposals";
import React from "react";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { daoName, iconURL, path } = useGovernor();
  return (
    <GovernancePage
      title={
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
          <div className="flex items-center gap-2">
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
        className="mt-8"
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
