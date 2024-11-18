import { mapSome, tsToDate } from "@saberhq/solana-contrib";
import { useSmartWallet } from "@/hooks/useSmartWallet";
import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { EmptyState } from "../../../../../common/EmptyState";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { ExecuteProposalButton } from "./ExecuteProposalButton";
export const PendingTXs = () => {
    const { parsedTXs, smartWalletData } = useSmartWallet();
    const pendingTXs = parsedTXs?.filter((tx) => {
        if (!tx.tx) {
            return false;
        }
        const gracePeriodEnd = mapSome(tx.tx, (t) => mapSome(smartWalletData, (d) => !t.account.eta.isNeg()
            ? tsToDate(t.account.eta.add(d.account.gracePeriod))
            : null));
        if (gracePeriodEnd && gracePeriodEnd <= new Date()) {
            return false;
        }
        return tx.tx?.account.executedAt.isNeg() ?? false;
    });
    return (React.createElement(TableCardBody, null,
        pendingTXs?.map((tx) => (React.createElement("tr", { key: tx.tx.publicKey.toString() },
            React.createElement("td", null,
                "TX-",
                tx.tx.account.index.toNumber()),
            React.createElement("td", null, tx.instructions.map((ix) => ix.title).join(", ")),
            React.createElement("td", null,
                React.createElement(ExecuteProposalButton, { tx: tx.tx }))))),
        pendingTXs?.length === 0 && (React.createElement(EmptyState, { title: "No pending transactions found." })),
        pendingTXs === undefined && React.createElement(LoadingPage, null)));
};
