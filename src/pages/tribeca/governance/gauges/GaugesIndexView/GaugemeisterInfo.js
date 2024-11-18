import { GaugeSDK } from "@quarryprotocol/gauge";
import { useSail } from "@rockooor/sail";
import Countdown from "react-countdown";
import invariant from "tiny-invariant";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { tsToDate } from "../../../../../utils/utils";
import { AsyncButton } from "../../../../common/AsyncButton";
import { ContentLoader } from "../../../../common/ContentLoader";
import { Card } from "../../../../common/governance/Card";
import { CardItem } from "../../locker/LockerIndexView/locked-voter/CardItem";
import { useGaugemeister } from "../hooks/useGaugemeister";
export const GaugemeisterInfo = ({ className }) => {
    const gaugemeister = useGaugemeister();
    const { data: gm } = useParsedGaugemeister(gaugemeister);
    const nextEpochStartsAt = gm
        ? tsToDate(gm.accountInfo.data.nextEpochStartsAt)
        : null;
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    return (React.createElement(Card, { title: "Epoch Info", className: className },
        React.createElement(CardItem, { label: "Current Epoch" },
            React.createElement("div", { tw: "flex items-center gap-2.5 h-7" }, gm ? (gm.accountInfo.data.currentRewardsEpoch) : (React.createElement("div", { tw: "h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" })))),
        React.createElement(CardItem, { label: "Next Epoch Start" },
            React.createElement("div", { tw: "flex items-center gap-2.5 h-7" }, nextEpochStartsAt ? (nextEpochStartsAt <= new Date() ? (React.createElement(AsyncButton, { onClick: async (sdkMut) => {
                    invariant(gaugemeister);
                    const gaugeSDK = GaugeSDK.load({
                        provider: sdkMut.provider,
                    });
                    const triggerTX = gaugeSDK.gauge.triggerNextEpoch({
                        gaugemeister,
                    });
                    await handleTX(await wrapTx(triggerTX), "Trigger next epoch");
                } }, "Trigger next epoch")) : (React.createElement(Countdown, { date: nextEpochStartsAt }))) : (React.createElement(ContentLoader, { tw: "h-4 w-12" })))),
        React.createElement(CardItem, { label: "Next Rewards Period" },
            React.createElement("div", { tw: "flex items-center gap-2.5 h-14 text-sm leading-snug" }, nextEpochStartsAt ? (React.createElement(React.Fragment, null,
                nextEpochStartsAt.toLocaleString(),
                " -",
                React.createElement("br", null),
                new Date(nextEpochStartsAt.getTime() +
                    (gm?.accountInfo.data.epochDurationSeconds ?? 0) * 1000).toLocaleString())) : (React.createElement(ContentLoader, { tw: "h-4 w-12" }))))));
};
