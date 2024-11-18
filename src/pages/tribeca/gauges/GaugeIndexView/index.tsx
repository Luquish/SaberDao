import { usePubkey } from "@rockooor/sail";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { useGauge } from "../hooks/useGauges";

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  const stakedMint = paths[paths.indexOf('gauges') + 1] || '';
  return { stakedMint };
}

export const GaugesIndexView: React.FC = () => {
  const location = useLocation();
  const { stakedMint: stakedMintStr } = getParams(location.pathname);
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
