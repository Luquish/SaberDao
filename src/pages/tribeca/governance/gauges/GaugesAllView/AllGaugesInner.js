import { findEpochGaugeAddress, GaugeSDK } from "@quarryprotocol/gauge";
import { QuarrySDK } from "@quarryprotocol/quarry-sdk";
import { useSail } from "@rockooor/sail";
import { PublicKey, TransactionEnvelope } from "@saberhq/solana-contrib";
import { chunk } from "lodash-es";
import invariant from "tiny-invariant";
import React from 'react';
import { useSDK } from "@/contexts/sdk";
import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { useGM } from "../context";
import { GaugeList } from "../GaugesIndexView/GaugeList";
import { useAllGauges } from "../hooks/useGauges";
export const AllGaugesInner = () => {
    const { gaugemeister } = useGM();
    const { gaugeKeys } = useAllGauges();
    const { sdkMut } = useSDK();
    const { handleTXs } = useSail();
    const { wrapTx } = useWrapTx();
    const syncGauges = async () => {
        invariant(sdkMut && gaugemeister && gaugeKeys);
        const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider });
        const gaugeData = (await gaugeSDK.programs.Gauge.account.gauge.fetchMultiple(gaugeKeys));
        const gmData = await gaugeSDK.gauge.fetchGaugemeister(gaugemeister);
        if (!gmData) {
            throw new Error("gaugemeister data not found");
        }
        const syncTXs = await Promise.all(gaugeKeys.map(async (gauge, i) => {
            if (!gaugeData[i]) {
                return null;
            }
            const [epochGauge] = await findEpochGaugeAddress(gauge, gmData.currentRewardsEpoch);
            // skip over null epochs
            if (!(await gaugeSDK.provider.connection.getAccountInfo(epochGauge))) {
                return null;
            }
            return await gaugeSDK.gauge.syncGauge({ gauge: new PublicKey(gauge) });
        }) ?? []);
        const { pending, success } = await handleTXs(await wrapTx(TransactionEnvelope.pack(...syncTXs.filter((tx) => !!tx))), "Sync Gauges");
        await Promise.all(pending);
        if (!success) {
            return;
        }
        const quarrySDK = QuarrySDK.load({ provider: sdkMut.provider });
        const rewarderW = await quarrySDK.mine.loadRewarderWrapper(gmData.rewarder);
        const quarryData = (await quarrySDK.programs.Mine.account.quarry.fetchMultiple(gaugeData.filter((g) => !!g).map((g) => g.quarry)));
        const quarrySyncTXs = await Promise.all(chunk(quarryData.map((q) => q.tokenMintKey), 10).map(async (mints) => {
            return await rewarderW.syncQuarryRewards(mints);
        }));
        await handleTXs(quarrySyncTXs, "Sync Quarries");
    };
    useGovWindowTitle(`All Gauges`);
    return (React.createElement("div", { className: "flex flex-col gap-4" },
        React.createElement(Card, { className: "flex items-center justify-between", title: React.createElement(React.Fragment, null,
                React.createElement("span", null, "All Gauges"),
                React.createElement(Button, { variant: "outline", onClick: syncGauges }, "Sync Rewards with Gauges")) },
            React.createElement("div", { className: "whitespace-nowrap overflow-x-auto" },
                React.createElement(GaugeList, null)))));
};
