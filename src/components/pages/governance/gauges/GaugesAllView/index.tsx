import { RewarderProvider } from "@rockooor/react-quarry";

import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { useGM } from "../context";
import { AllGaugesInner } from "./AllGaugesInner";

export const GaugesAllView: React.FC = () => {
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
          <LoadingPage tw="h-96" />
        </Card>
      )}
    </GovernancePage>
  );
};

export default GaugesAllView;
