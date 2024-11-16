import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useCardinalResolvedAddress } from "../../../../../hooks/tribeca/cardinal/useCardinalResolvedAddress";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { LockerSnapshots } from "../../locker/LockerIndexView/locked-voter/LockerSnapshots";
import { AllLockerSnapshotsTable } from "./AllLockerSnapshotsTable";

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  const voter = paths[paths.indexOf('address') + 1] || '';
  return { voter };
}

export const VoterSnapshotsView: React.FC = () => {
  const location = useLocation();
  const { voter: voterKeyStr = "" } = getParams(location.pathname);
  const voterKey = useCardinalResolvedAddress(voterKeyStr);

  return (
    <GovernancePage title="Vote Locker Snapshots">
      <div className="flex flex-col gap-4">
        <LockerSnapshots owner={voterKey} />
        <AllLockerSnapshotsTable owner={voterKey} />
      </div>
    </GovernancePage>
  );
};

export default VoterSnapshotsView;
