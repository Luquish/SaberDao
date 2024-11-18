import { COMMON_ERA_UNIX_TS, ERA_NUM_PERIODS, PERIOD_SECONDS, } from "@saberhq/snapshots";
import { useSDK } from "@/contexts/sdk";
import { TableCardBody } from "@/common/card/TableCardBody";
import { Card } from "@/common/governance/Card";
import { LoadingSpinner } from "@/common/LoadingSpinner";
import { CreateEscrowHistoryButton } from "./CreateEscrowHistoryButton";
import { CreateLockerHistoryButton } from "./CreateLockerHistoryButton";
import { SyncEscrowHistoryButton } from "./SyncEscrowHistoryButton";
import { useSnapshotHistories } from "./useSnapshotHistories";
const secondsPerEra = PERIOD_SECONDS * ERA_NUM_PERIODS;
const calculateEraStart = (era) => new Date((COMMON_ERA_UNIX_TS + era * secondsPerEra) * 1_000);
export const LockerSnapshots = ({ owner }) => {
    const { tribecaMut } = useSDK();
    const { lockerHistories, escrowHistories, eras, lockerKey, escrow } = useSnapshotHistories(owner ?? tribecaMut?.provider.walletKey);
    return (React.createElement(Card, { title: "Snapshots" }, lockerKey && (React.createElement(TableCardBody, { head: React.createElement("tr", null,
            React.createElement("th", null, "#"),
            React.createElement("th", null, "Period")) }, eras?.map((era, i) => {
        const lockerHistory = lockerHistories?.[i];
        const escrowHistory = escrowHistories?.[i];
        const startIndex = escrowHistory?.account.veBalances.findIndex((v) => !v.isZero());
        const endIndexReversed = escrowHistory?.account.veBalances
            .slice()
            .reverse()
            .findIndex((v) => !v.isZero());
        const endIndex = endIndexReversed !== undefined
            ? endIndexReversed !== -1
                ? ERA_NUM_PERIODS - endIndexReversed - 1
                : -1
            : undefined;
        return (React.createElement("tr", { key: era },
            React.createElement("td", null, era),
            React.createElement("td", null,
                calculateEraStart(era).toLocaleDateString(),
                " to",
                " ",
                calculateEraStart(era + 1).toLocaleDateString()),
            React.createElement("td", null,
                React.createElement("div", null,
                    React.createElement("p", null,
                        "Starts: ",
                        startIndex),
                    React.createElement("p", null,
                        "Ends: ",
                        endIndex))),
            React.createElement("td", null, lockerHistory === undefined ||
                (escrow && escrowHistory === undefined) ? (React.createElement(LoadingSpinner, null)) : lockerHistory === null ? (React.createElement(CreateLockerHistoryButton, { locker: lockerKey, era: era })) : !escrowHistory ? (escrow ? (React.createElement(CreateEscrowHistoryButton, { escrow: escrow.escrowW.escrowKey, era: era })) : ("No veTokens locked")) : (React.createElement(SyncEscrowHistoryButton, { lockerHistory: lockerHistory, escrowHistory: escrowHistory })))));
    })))));
};
