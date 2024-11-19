import { useLocation } from "@reach/router";
import React from "react";
import clsx from "clsx";

import { useCardinalResolvedAddress } from "@/hooks/tribeca/cardinal/useCardinalResolvedAddress";
import GovernancePage from "@/components/tribeca/common/governance/GovernancePage";
import LockerSnapshots from "@/pages/tribeca/locker/LockerIndexView/locked-voter/LockerSnapshots";
import AllLockerSnapshotsTable from "./AllLockerSnapshotsTable";
import { getUrlParams } from "@/utils/tribeca/urlParams";

const VoterSnapshotsView: React.FC = () => {
  const location = useLocation();
  const voterKeyStr = getUrlParams.voter(location.pathname);
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
