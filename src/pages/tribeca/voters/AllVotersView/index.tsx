import React from "react";

import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import TopVotersCard from "./TopVotersCard";

export const AllVotersView: React.FC = () => {
  const { path } = useGovernor();
  useGovWindowTitle(`All Voters`);
  return (
    <GovernancePage
      title="Leaderboard"
      backLink={{
        label: "Overview",
        href: `${path}`,
      }}
    >
      <TopVotersCard />
    </GovernancePage>
  );
};

export default AllVotersView;
