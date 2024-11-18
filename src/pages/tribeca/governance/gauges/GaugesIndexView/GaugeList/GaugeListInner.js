import { findEpochGaugeAddress } from "@quarryprotocol/gauge";
import { useRewarder } from "@rockooor/react-quarry";
import { exists } from "@saberhq/solana-contrib";
import { useQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { useMemo } from "react";
import invariant from "tiny-invariant";
import { useBatchedEpochGauges } from "@/utils/tribeca/parsers";
import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { useGM } from "../../context";
import { useAllGauges } from "../../hooks/useGauges";
import { GaugeListRow } from "./GaugeListRow";
import { GaugeRowPlaceholder } from "./GaugeRowPlaceholder";
const DEFAULT_PLACEHOLDER_LIMIT = 10;
export const GaugeListInner = ({ limit }) => {
    const { quarries, rewarder } = useRewarder();
    const { gaugemeister, votingEpoch } = useGM();
    const { gauges, gaugeKeys } = useAllGauges();
    const { data: epochGaugeKeys } = useQuery({
        queryKey: ["epochGaugeKeys", gaugemeister?.toString(), votingEpoch],
        queryFn: async () => {
            invariant(gaugemeister && gaugeKeys && votingEpoch);
            return await Promise.all(gaugeKeys.map(async (gaugeKey) => {
                const [key] = await findEpochGaugeAddress(gaugeKey, votingEpoch);
                return key;
            }));
        },
        enabled: !!gaugemeister && !!gaugeKeys && exists(votingEpoch),
    });
    const { data: epochGauges } = useBatchedEpochGauges(epochGaugeKeys);
    const totalShares = useMemo(() => epochGauges?.every((eg) => eg !== undefined)
        ? epochGauges
            .map((eg) => eg?.account.totalPower ?? new BN(0))
            .reduce((acc, n) => acc.add(n), new BN(0))
        : null, [epochGauges]);
    const sortedEpochGauges = useMemo(() => epochGauges?.slice().sort((a, b) => {
        if (!a) {
            return 1;
        }
        if (!b) {
            return -1;
        }
        return -a.account.totalPower.cmp(b.account.totalPower);
    }), [epochGauges]);
    const gaugesExisting = useMemo(() => gauges
        ?.filter((gauge) => gauge !== null)
        .map((gauge) => {
        if (!gauge) {
            return gauge;
        }
        const quarry = quarries?.find((q) => q.key.equals(gauge.account.quarry));
        if (!quarry) {
            return quarry;
        }
        const nextRank = (sortedEpochGauges?.findIndex((eg) => eg?.account.gauge.equals(gauge.publicKey)) ?? -1) + 1;
        return { gauge, quarry, nextRank: nextRank === 0 ? null : nextRank };
    })
        .sort((a, b) => {
        if (!a) {
            return 1;
        }
        if (!b) {
            return -1;
        }
        const { gauge: gaugeA, quarry: quarryA } = a;
        const { gauge: gaugeB, quarry: quarryB } = b;
        if (gaugeA.account.isDisabled) {
            return 1;
        }
        if (gaugeB.account.isDisabled) {
            return -1;
        }
        return -quarryA.quarry.account.rewardsShare.cmp(quarryB.quarry.account.rewardsShare);
    })
        .map((el, i) => {
        if (el) {
            return { ...el, currentRank: i + 1 };
        }
        return el;
    })
        .sort((a, b) => {
        if (!a) {
            return 1;
        }
        if (!b) {
            return -1;
        }
        // null is disabled gauges
        if (!a.nextRank) {
            return 1;
        }
        if (!b.nextRank) {
            return -1;
        }
        return a.nextRank > b.nextRank ? 1 : -1;
    })
        .slice(0, limit ?? gauges.length), [gauges, limit, quarries, sortedEpochGauges]);
    return (React.createElement(TableCardBody, { head: React.createElement("tr", null,
            React.createElement("th", { tw: "w-20" }, "#"),
            React.createElement("th", null, "Gauge"),
            React.createElement("th", { tw: "w-48" }, "Current Share"),
            React.createElement("th", { tw: "w-48" }, "Next Share")) },
        !gaugesExisting ||
            (gaugesExisting.length === 0 &&
                Array(limit ?? DEFAULT_PLACEHOLDER_LIMIT)
                    .fill(null)
                    .map((_, i) => React.createElement(GaugeRowPlaceholder, { key: i }))),
        gaugesExisting?.map((result, i) => {
            if (!result) {
                return React.createElement(GaugeRowPlaceholder, { key: i });
            }
            const { gauge, quarry, currentRank, nextRank } = result;
            return (React.createElement(GaugeListRow, { key: quarry.key.toString(), quarry: quarry, gauge: gauge, currentRank: currentRank, nextRank: nextRank, totalShares: totalShares, dailyRewardsRate: rewarder
                    ? rewarder.account.annualRewardsRate.div(new BN(365))
                    : rewarder }));
        })));
};
