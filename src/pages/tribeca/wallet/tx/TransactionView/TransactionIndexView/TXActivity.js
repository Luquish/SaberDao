import formatDistance from "date-fns/formatDistance";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { TXLink } from "../../../../../common/TXLink";
import { useTransaction } from "../context";
import { TXEvent } from "./TXEvent";
export const TXActivity = () => {
    const { historicalTXs } = useTransaction();
    const txsWithEvents = historicalTXs?.flatMap((tx) => tx.events.map((event) => ({ tx, event })));
    return (React.createElement("div", null,
        React.createElement("h2", { tw: "mt-8 text-gray-800 font-semibold mb-4" }, "Activity"),
        txsWithEvents ? (React.createElement("div", { tw: "text-xs flex flex-col gap-4" }, txsWithEvents.map(({ tx, event }, i) => {
            return (React.createElement("div", { key: `${tx.sig}_${i}`, tw: "text-gray-500 inline-flex items-center gap-4" },
                React.createElement("span", null,
                    React.createElement(TXEvent, { event: event })),
                React.createElement("span", null, "timestamp" in event.data
                    ? formatDistance(new Date(event.data.timestamp.toNumber() * 1_000), new Date(), { addSuffix: true })
                    : ""),
                React.createElement(TXLink, { txSig: tx.sig, tw: "text-primary hover:text-primary-300" }, " ")));
        }))) : (React.createElement(LoadingPage, null))));
};
