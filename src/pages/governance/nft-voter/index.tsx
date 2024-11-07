import {
  useGovernor,
  useGovWindowTitle,
} from "src/hooks/governance/useGovernor";;
import { GovernancePage } from "src/pages/governance/GovernancePage";
import React from "react";
import { MarinadeMigration } from "src/pages/governance/MarinadeMigration";
import { RecentProposals } from "./RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
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
