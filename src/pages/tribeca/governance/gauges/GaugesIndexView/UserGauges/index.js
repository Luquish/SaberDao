import { findEpochGaugeVoterAddress, findGaugeVoterAddress, } from "@quarryprotocol/gauge";
import { ZERO } from "@quarryprotocol/quarry-sdk";
import { useQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { FaExclamationTriangle } from "react-icons/fa";
import invariant from "tiny-invariant";
import React from 'react';
import { useSDK } from "@/contexts/sdk";
import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useEpochGaugeVoterData, useGaugeVoterData, } from "@/utils/tribeca/parsers";
import { TableCardBody } from "@/components/tribeca/common/card/TableCardBody";
import { EmptyState, EmptyStateConnectWallet, } from "@/components/tribeca/common/EmptyState";
import { Card } from "@/components/tribeca/common/governance/Card";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import { MouseoverTooltip } from "@/components/tribeca/common/MouseoverTooltip";
import { LockupTooShortTooltip } from "../../GaugesSetupView/lockupTooShortTooltip";
import { useGaugemeister, useGMData } from "../../hooks/useGaugemeister";
import { useMyGauges } from "../../hooks/useMyGauges";
import { SyncModal } from "./SyncModal";
import { UserGauge } from "./UserGauge";
const NUM_GAUGES_TO_DISPLAY = 3;
export const UserGauges = () => {
    const { path } = useGovernor();
    const { sdkMut } = useSDK();
    const { myGauges, hasNoGauges, gaugeVotes } = useMyGauges();
    const gaugemeister = useGaugemeister();
    const { data: gmData } = useGMData();
    const { escrow, escrowKey } = useUserEscrow();
    const votingEpoch = gmData ? gmData.account.currentRewardsEpoch + 1 : null;
    const { data: epochGaugeVoterKey } = useQuery({
        queryKey: ["epochGaugeVoterKey", votingEpoch],
        queryFn: async () => {
            invariant(votingEpoch && gaugemeister && escrowKey);
            const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrowKey);
            const [epochGaugeVoter] = await findEpochGaugeVoterAddress(gaugeVoter, votingEpoch);
            return { gaugeVoter, epochGaugeVoter };
        },
        enabled: !!(votingEpoch !== null && escrowKey && gaugemeister),
    });
    const { data: gaugeVoter } = useGaugeVoterData(epochGaugeVoterKey?.gaugeVoter);
    const { data: epochGaugeVoter } = useEpochGaugeVoterData(epochGaugeVoterKey?.epochGaugeVoter);
    const expectedPower = gmData && escrow
        ? escrow.calculateVotingPower(gmData.account.nextEpochStartsAt.toNumber())
        : null;
    const isVotesChanged = gaugeVoter &&
        epochGaugeVoter &&
        expectedPower &&
        !expectedPower
            .sub(epochGaugeVoter.account.allocatedPower)
            .abs()
            // rounding error can be up to the number of gauges
            .lt(new BN(myGauges?.length ?? 0));
    const isDirty = gaugeVoter &&
        (!epochGaugeVoter ||
            !gaugeVoter.account.weightChangeSeqno.eq(epochGaugeVoter.account.weightChangeSeqno));
    const showSyncButton = isVotesChanged || isDirty;
    const lockupTooShort = escrow?.escrow.escrowEndsAt.lt(gmData?.account.nextEpochStartsAt ?? ZERO);
    return (React.createElement(Card, { className: "flex items-center justify-between", title: React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex" },
                React.createElement("span", null, "Your Gauge Votes"),
                lockupTooShort && React.createElement(LockupTooShortTooltip, null)),
            showSyncButton && (React.createElement("div", null,
                React.createElement(ModalButton, { buttonLabel: "Sync", buttonProps: {
                        variant: "outline",
                    } },
                    React.createElement(SyncModal, null))))), link: sdkMut
            ? {
                title: `${hasNoGauges
                    ? "Cast Votes"
                    : (myGauges?.length ?? 0) > NUM_GAUGES_TO_DISPLAY
                        ? "View All Votes"
                        : "Edit Gauge Votes"}`,
                href: `${path}/gauges/weights`,
            }
            : undefined }, !sdkMut ? (React.createElement(EmptyStateConnectWallet, { title: "Connect your wallet to vote on gauges." })) : gaugeVotes === undefined ? (React.createElement("div", { className: "flex h-[195px] w-full justify-center items-center" },
        React.createElement(LoadingPage, null))) : hasNoGauges ? (React.createElement(EmptyState, { title: "You haven't voted on any gauges yet." })) : (React.createElement("div", { className: "text-sm w-full whitespace-nowrap overflow-x-auto" },
        React.createElement(TableCardBody, { head: React.createElement("tr", null,
                React.createElement("th", null, "Gauge"),
                React.createElement("th", null, isDirty || isVotesChanged ? (React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("span", null, "Your Votes"),
                    React.createElement(MouseoverTooltip, { text: isDirty
                            ? "Your votes have yet to be committed. Please click the 'Sync' button to the right."
                            : "Your voting escrow balance has changed. Please click the 'Sync' button to the right to maximize your voting power." },
                        React.createElement(FaExclamationTriangle, { className: "text-yellow-500" })))) : (React.createElement(React.Fragment, null, "Your Votes"))),
                React.createElement("th", null, "Weight")) },
            !myGauges || myGauges.length === 0 ? (React.createElement("tr", null,
                React.createElement("td", { colSpan: 3 },
                    React.createElement("div", { className: "flex h-[195px] w-full justify-center items-center" },
                        React.createElement(LoadingPage, null))))) : (myGauges
                ?.slice(0, NUM_GAUGES_TO_DISPLAY)
                .filter((gv) => gv.weight !== 0)
                .map((gaugeVote, i) => (React.createElement(UserGauge, { className: i !== myGauges.length - 1 ? "border-b border-b-warmGray-800" : "", key: gaugeVote.key.toString(), gaugeVote: gaugeVote })))),
            myGauges && myGauges.length > NUM_GAUGES_TO_DISPLAY && (React.createElement("tr", null,
                React.createElement("td", null),
                React.createElement("td", null,
                    myGauges.length - NUM_GAUGES_TO_DISPLAY,
                    " more ... "),
                React.createElement("td", null))))))));
};
