import { TokenAmount } from "@saberhq/token-utils";

import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "../../../../../utils/format";
import { AttributeList } from "../../../../common/AttributeList";
import { Card } from "../../../../common/governance/Card";

export const LockerInfo: React.FC = () => {
  const { lockerData, minActivationThreshold, govToken } = useGovernor();
  return (
    <Card title="Locker">
      <AttributeList
        transformLabel={false}
        attributes={{
          Locker: lockerData?.publicKey,
          "Total Locked": govToken
            ? lockerData
              ? new TokenAmount(govToken, lockerData.account.lockedSupply)
              : lockerData
            : lockerData?.account.lockedSupply,
          "Governance Token": govToken,
          "Min Stake Duration": lockerData
            ? formatDurationSeconds(
                lockerData.account.params.minStakeDuration.toNumber()
              )
            : lockerData,
          "Max Stake Duration": lockerData
            ? formatDurationSeconds(
                lockerData.account.params.maxStakeDuration.toNumber()
              )
            : lockerData,
          "Max Vote Multiplier":
            lockerData?.account.params.maxStakeVoteMultiplier,
          "Votes to Activate a Proposal": minActivationThreshold,
        }}
      />
    </Card>
  );
};
