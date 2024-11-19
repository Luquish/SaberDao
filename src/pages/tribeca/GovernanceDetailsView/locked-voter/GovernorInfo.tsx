import { TokenAmount } from "@saberhq/token-utils";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "@/utils/tribeca/format";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import Card from "@/components/tribeca/common/governance/Card";
import React from "react";

const GovernorInfo: React.FC = () => {
  const { governorData, governor, veToken } = useGovernor();
  const votesForQuorum =
    governorData && veToken
      ? new TokenAmount(veToken, governorData.account.params.quorumVotes)
      : null;

  return (
    <Card title="Governor" className="pb-2">
      <AttributeList
        transformLabel={false}
        attributes={{
          Governor: governor,
          "Smart Wallet": governorData?.account.smartWallet,
          Electorate: governorData?.account.electorate,
          "Votes for Quorum": votesForQuorum?.formatUnits(),
          "Timelock Delay (seconds)": governorData
            ? formatDurationSeconds(
              governorData.account.params.timelockDelaySeconds.toNumber()
            )
            : governorData,
          "Voting Delay": governorData
            ? formatDurationSeconds(
              governorData.account.params.votingDelay.toNumber()
            )
            : governorData,
          "Voting Period": governorData
            ? formatDurationSeconds(
              governorData.account.params.votingPeriod.toNumber()
            )
            : governorData,
        }}
      />
    </Card>
  );
};

export default GovernorInfo;