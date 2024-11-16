import { Token } from "@saberhq/token-utils";
import type {
  GovernanceParameters,
  LockerParams,
} from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { useMemo } from "react";

import type { GovernorInfo } from "../../../../hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "../../../../utils/format";
import { AttributeList } from "../../../common/AttributeList";
import { Card } from "../../../common/governance/Card";
import { LoadingPage } from "../../../common/LoadingPage";

interface Props {
  info: GovernorInfo;
}

export const InitializeGovernanceCard: React.FC<Props> = ({ info }: Props) => {
  const { manifest } = info;

  const underlyingToken = manifest
    ? new Token(manifest.governance.token)
    : manifest;
  const { lockerParams, governorParams } = useMemo(() => {
    if (!manifest) {
      return { lockerParams: manifest, governorParams: manifest };
    }
    const { locker, governor } = manifest.governance.parameters ?? {};
    const lockerParams: LockerParams | null = locker
      ? {
          whitelistEnabled: locker.whitelistEnabled,
          maxStakeVoteMultiplier: locker.maxStakeVoteMultiplier,
          minStakeDuration: new BN(locker.minStakeDuration),
          maxStakeDuration: new BN(locker.maxStakeDuration),
          proposalActivationMinVotes: new BN(locker.proposalActivationMinVotes),
        }
      : null;
    const governorParams: GovernanceParameters | null = governor
      ? {
          votingDelay: new BN(governor.votingDelay),
          votingPeriod: new BN(governor.votingPeriod),
          quorumVotes: new BN(governor.quorumVotes),
          timelockDelaySeconds: new BN(governor.timelockDelay),
        }
      : null;
    return { lockerParams, governorParams };
  }, [manifest]);

  return (
    <div>
      <Card tw="mt-8" title="Initialize DAO">
        {underlyingToken === undefined && <LoadingPage />}
        {underlyingToken && (
          <div>
            <p>Set up your DAO.</p>
            {governorParams && (
              <div>
                <h2>Governor</h2>
                <AttributeList
                  transformLabel={false}
                  attributes={{
                    "Votes for Quorum":
                      governorParams.quorumVotes.toNumber() /
                      10 ** underlyingToken.decimals,
                    "Timelock Delay (seconds)": formatDurationSeconds(
                      governorParams.timelockDelaySeconds.toNumber()
                    ),
                    "Voting Delay": formatDurationSeconds(
                      governorParams.votingDelay.toNumber()
                    ),
                    "Voting Period": formatDurationSeconds(
                      governorParams.votingPeriod.toNumber()
                    ),
                  }}
                />
              </div>
            )}
            {lockerParams && (
              <div>
                <h2>Vote Escrow Locker</h2>
                <AttributeList
                  transformLabel={false}
                  attributes={{
                    "Membership Token": underlyingToken,
                    "Min Stake Duration": formatDurationSeconds(
                      lockerParams.minStakeDuration.toNumber()
                    ),
                    "Max Stake Duration": formatDurationSeconds(
                      lockerParams.maxStakeDuration.toNumber()
                    ),
                    "Max Vote Multiplier": lockerParams.maxStakeVoteMultiplier,
                    "Votes to Activate a Proposal":
                      lockerParams.proposalActivationMinVotes.toNumber() /
                      10 ** underlyingToken.decimals,
                    "CPI Whitelist Enabled?": lockerParams.whitelistEnabled,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
