import { useParams } from "react-router-dom";

import { useCardinalResolvedAddress } from "../../../../../hooks/cardinal/useCardinalResolvedAddress";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { LockerSnapshots } from "../../locker/LockerIndexView/locked-voter/LockerSnapshots";
import { AllLockerSnapshotsTable } from "./AllLockerSnapshotsTable";

export const VoterSnapshotsView: React.FC = () => {
  const { voter: voterKeyStr = "" } = useParams<"voter">();
  const voterKey = useCardinalResolvedAddress(voterKeyStr);
  return (
    <GovernancePage title="Vote Locker Snapshots">
      <div tw="flex flex-col gap-4">
        <LockerSnapshots owner={voterKey} />
        <AllLockerSnapshotsTable owner={voterKey} />
      </div>
    </GovernancePage>
  );
};

export default VoterSnapshotsView;
