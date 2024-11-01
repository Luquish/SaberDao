import { usePubkey } from "@rockooor/sail";
import { useParams } from "react-router-dom";

import { useGovWindowTitle } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { useGauge } from "../hooks/useGauges";

export const GaugesIndexView: React.FC = () => {
  const { stakedMint: stakedMintStr } = useParams<{ stakedMint: string }>();
  const { token } = useGauge(usePubkey(stakedMintStr));
  useGovWindowTitle(`Gauge - ${token?.name ?? ""}`);
  return (
    <GovernancePage title="Gauge">
      <div tw="flex flex-wrap md:flex-nowrap gap-4 items-start"></div>
    </GovernancePage>
  );
};
