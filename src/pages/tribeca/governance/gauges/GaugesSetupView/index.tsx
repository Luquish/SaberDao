import { useGovWindowTitle } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { SetupGaugesCard } from "./SetupGaugesCard";

export const GaugesSetupView: React.FC = () => {
  useGovWindowTitle(`Setup Gauges`);
  return (
    <GovernancePage title="Setup Gauges">
      <div tw="flex flex-col gap-4">
        <SetupGaugesCard />
      </div>
    </GovernancePage>
  );
};

export default GaugesSetupView;
