import { RewarderProvider } from "@rockooor/react-quarry";

import React from "react";

import {
  useGovernor,
  useGovWindowTitle,
} from "@/hooks/tribeca/useGovernor";
import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import Card from "@/components/tribeca/common/governance/Card";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import { useGM } from "@/contexts/tribeca/gauges";
import AllGaugesInner from "./AllGaugesInner";

const GaugesAllView: React.FC = () => {
  const { path } = useGovernor();
  const { rewarderKey } = useGM();
  const { network } = useEnvironment();

  useGovWindowTitle(`All Gauges`);

  return (
    <GovernancePage
      title="All Gauges"
      backLink={{
        label: "Gauges",
        href: `${path}/gauges`,
      }}
    >
      {rewarderKey ? (
        <RewarderProvider initialState={{ rewarderKey, network }}>
          <AllGaugesInner />
        </RewarderProvider>
      ) : (
        <Card title="All Gauges">
          <LoadingPage className="h-96" />
        </Card>
      )}
    </GovernancePage>
  );
};

export default GaugesAllView;
