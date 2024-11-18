import { Token } from "@saberhq/token-utils";
import BN from "bn.js";
import { useMemo } from "react";
import { formatDurationSeconds } from "../../../../utils/format";
import { AttributeList } from "../../../common/AttributeList";
import { Card } from "../../../common/governance/Card";
import { LoadingPage } from "../../../common/LoadingPage";
export const InitializeGovernanceCard = ({ info }) => {
    const { manifest } = info;
    const underlyingToken = manifest
        ? new Token(manifest.governance.token)
        : manifest;
    const { lockerParams, governorParams } = useMemo(() => {
        if (!manifest) {
            return { lockerParams: manifest, governorParams: manifest };
        }
        const { locker, governor } = manifest.governance.parameters ?? {};
        const lockerParams = locker
            ? {
                whitelistEnabled: locker.whitelistEnabled,
                maxStakeVoteMultiplier: locker.maxStakeVoteMultiplier,
                minStakeDuration: new BN(locker.minStakeDuration),
                maxStakeDuration: new BN(locker.maxStakeDuration),
                proposalActivationMinVotes: new BN(locker.proposalActivationMinVotes),
            }
            : null;
        const governorParams = governor
            ? {
                votingDelay: new BN(governor.votingDelay),
                votingPeriod: new BN(governor.votingPeriod),
                quorumVotes: new BN(governor.quorumVotes),
                timelockDelaySeconds: new BN(governor.timelockDelay),
            }
            : null;
        return { lockerParams, governorParams };
    }, [manifest]);
    return (React.createElement("div", null,
        React.createElement(Card, { tw: "mt-8", title: "Initialize DAO" },
            underlyingToken === undefined && React.createElement(LoadingPage, null),
            underlyingToken && (React.createElement("div", null,
                React.createElement("p", null, "Set up your DAO."),
                governorParams && (React.createElement("div", null,
                    React.createElement("h2", null, "Governor"),
                    React.createElement(AttributeList, { transformLabel: false, attributes: {
                            "Votes for Quorum": governorParams.quorumVotes.toNumber() /
                                10 ** underlyingToken.decimals,
                            "Timelock Delay (seconds)": formatDurationSeconds(governorParams.timelockDelaySeconds.toNumber()),
                            "Voting Delay": formatDurationSeconds(governorParams.votingDelay.toNumber()),
                            "Voting Period": formatDurationSeconds(governorParams.votingPeriod.toNumber()),
                        } }))),
                lockerParams && (React.createElement("div", null,
                    React.createElement("h2", null, "Vote Escrow Locker"),
                    React.createElement(AttributeList, { transformLabel: false, attributes: {
                            "Membership Token": underlyingToken,
                            "Min Stake Duration": formatDurationSeconds(lockerParams.minStakeDuration.toNumber()),
                            "Max Stake Duration": formatDurationSeconds(lockerParams.maxStakeDuration.toNumber()),
                            "Max Vote Multiplier": lockerParams.maxStakeVoteMultiplier,
                            "Votes to Activate a Proposal": lockerParams.proposalActivationMinVotes.toNumber() /
                                10 ** underlyingToken.decimals,
                            "CPI Whitelist Enabled?": lockerParams.whitelistEnabled,
                        } }))))))));
};
