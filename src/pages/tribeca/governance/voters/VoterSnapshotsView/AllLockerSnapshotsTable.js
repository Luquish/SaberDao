import { calculatePeriodStart } from "@saberhq/snapshots";
import { Percent } from "@saberhq/token-utils";
import { zip } from "lodash-es";
import { useSDK } from "../../../../../contexts/sdk";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { useSnapshotHistories } from "../../locker/LockerIndexView/locked-voter/LockerSnapshots/useSnapshotHistories";
export const AllLockerSnapshotsTable = ({ owner }) => {
    const { tribecaMut } = useSDK();
    const { lockerHistories, escrowHistories, eras } = useSnapshotHistories(owner ?? tribecaMut?.provider.walletKey);
    const all = eras.flatMap((era, i) => {
        const lockerHistory = lockerHistories?.[i];
        const escrowHistory = escrowHistories?.[i];
        if (!lockerHistory || !escrowHistory) {
            return [];
        }
        return zip(lockerHistory.account.veBalances, escrowHistory.account.veBalances).map(([lockerBalance, escrowBalance], period) => {
            return {
                lockerBalance,
                escrowBalance,
                era,
                period,
            };
        });
    });
    return (React.createElement(Card, { title: "All Snapshots" },
        React.createElement(TableCardBody, { head: React.createElement("tr", null,
                React.createElement("th", null, "Start Date"),
                React.createElement("th", null, "Era"),
                React.createElement("th", null, "Period"),
                React.createElement("th", null, "Escrow Balance"),
                React.createElement("th", null, "%"),
                React.createElement("th", null, "Locker Balance")) }, all.map(({ era, period, lockerBalance, escrowBalance }) => {
            const start = calculatePeriodStart(era, period);
            const percent = escrowBalance && lockerBalance
                ? lockerBalance.isZero()
                    ? new Percent(0)
                    : new Percent(escrowBalance, lockerBalance)
                : null;
            return (React.createElement("tr", { key: `${era.toString()}_${period.toString()}` },
                React.createElement("td", null,
                    React.createElement("div", { tw: "flex flex-col gap-1" },
                        React.createElement("span", null, start.toLocaleDateString()))),
                React.createElement("td", null, era),
                React.createElement("td", null, period),
                React.createElement("td", null, escrowBalance?.toString()),
                React.createElement("td", null, percent
                    ? `${percent.toSignificant(6, {
                        groupSeparator: ",",
                    })}%`
                    : "--"),
                React.createElement("td", null, lockerBalance?.toString())));
        }))));
};
