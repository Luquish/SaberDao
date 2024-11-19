import { TokenAmount } from "@saberhq/token-utils";

import React from "react";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "@/utils/tribeca/format";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import Card from "@/components/tribeca/common/governance/Card";

const LockerInfo: React.FC = () => {
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

export default LockerInfo;