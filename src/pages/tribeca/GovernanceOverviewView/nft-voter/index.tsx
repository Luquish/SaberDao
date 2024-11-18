import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { ImageWithFallback } from "@/components/tribeca/common/ImageWithFallback";
import { MarinadeMigration } from "@/components/tribeca/common/MarinadeMigration";
import { RecentProposals } from "./RecentProposals";
import React from "react";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { daoName, iconURL } = useGovernor();
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
      preContent={<MarinadeMigration />}
      hideDAOName={true}
    >
      <RecentProposals />
    </GovernancePage>
  );
};
