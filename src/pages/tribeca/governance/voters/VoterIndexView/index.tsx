import { RewarderProvider } from "@rockooor/react-quarry";
import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useCardinalResolvedAddress } from "../../../../../hooks/tribeca/cardinal/useCardinalResolvedAddress";
import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { useGMData } from "../../gauges/hooks/useGaugemeister";
import { VoterHeader } from "./VoterHeader";
import { VoterInner } from "./VoterInner";

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  const voter = paths[paths.indexOf('address') + 1] || '';
  return { voter };
}

export const VoterIndexView: React.FC = () => {
  const location = useLocation();
  const { voter: voterKeyStr = "" } = getParams(location.pathname);
  const voterKey = useCardinalResolvedAddress(voterKeyStr);
  const { path } = useGovernor();
  const { data: gm } = useGMData();
  const { network } = useEnvironment();
  const rewarderKey = gm?.account.rewarder;

  useGovWindowTitle(`Voter`);
  return (
    <GovernancePage
      backLink={{
        label: "Leaderboard",
        href: `${path}/leaderboard`,
      }}
      title={<VoterHeader voterKey={voterKey} />}
    >
      {voterKey && rewarderKey && (
        <RewarderProvider initialState={{ rewarderKey, network }}>
          <VoterInner voterKey={voterKey} />
        </RewarderProvider>
      )}
    </GovernancePage>
  );
};

export default VoterIndexView;
