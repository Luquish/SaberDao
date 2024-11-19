import { usePubkey } from "@rockooor/sail";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import { useGauge } from "@/hooks/tribeca/useGauges";
import { getUrlParams } from "@/utils/tribeca/urlParams";


const GaugesIndexView: React.FC = () => {
  const location = useLocation();
  const stakedMintStr = getUrlParams.gauge(location.pathname);
  const { token } = useGauge(usePubkey(stakedMintStr));
  useGovWindowTitle(`Gauge - ${token?.name ?? ""}`);
  
  return (
    <GovernancePage title="Gauge">
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-start">
      </div>
    </GovernancePage>
  );
};

export default GaugesIndexView;
