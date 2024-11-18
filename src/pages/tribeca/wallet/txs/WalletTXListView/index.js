import React from "react";
import { GiTumbleweed } from "react-icons/gi";
import { Link } from "gatsby";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { Button } from "../../../../../components/tribeca/common/Button";
import { EmptyState } from "../../../../../components/tribeca/common/EmptyState";
import { IXSummary } from "../../../../../components/tribeca/common/governance/IXSummary";
const LISTS = {
    all: {
        title: "All Transactions",
    },
    pending: {
        title: "Pending Transactions",
        filter: (tx) => tx.tx?.account.executedAt.isNeg() ?? false,
    },
    executed: {
        title: "Executed Transactions",
        filter: (tx) => !tx.tx?.account.executedAt.isNeg() ?? false,
    },
};
export const WalletTXListView = ({ location }) => {
    const listId = location?.pathname?.split('/')?.pop() ?? "all";
    const list = LISTS[listId];
    const { path, parsedTXs: allParsedTXs, key, threshold } = useSmartWallet();
    const parsedTXs = list.filter
        ? allParsedTXs?.filter(list.filter)
        : allParsedTXs;
    return (React.createElement("div", { className: "w-full" },
        React.createElement("div", { className: "h-[57px] w-full flex items-center justify-between px-6 text-sm border-b" },
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("h1", { className: "text-gray-800 font-medium" }, list.title),
                React.createElement("span", { className: "text-secondary" }, parsedTXs?.length)),
            React.createElement(Link, { to: `${path}/propose` },
                React.createElement(Button, null, "Propose Transaction"))),
        parsedTXs?.length === 0 && (React.createElement("div", { className: "flex items-center justify-center", style: { height: "calc(80vh - 57px)" } },
            React.createElement(EmptyState, { icon: React.createElement(GiTumbleweed, null), title: `No ${listId === "all"
                    ? " transactions"
                    : list.title.toLocaleLowerCase()}.` },
                React.createElement(Link, { className: "text-primary", to: `${path}/propose` }, "Propose a transaction")))),
        React.createElement("div", null, parsedTXs?.map(({ tx, index, instructions }, i) => {
            const numSigned = (tx?.account.signers ?? []).filter((x) => !!x).length;
            return (React.createElement(Link, { key: `tx_${index ?? `unknown_${i}`}`, to: `/wallets/${key.toString()}/tx/${tx?.account.index.toNumber() ?? ""}`, className: "h-[44px] flex items-center justify-between px-6 text-sm w-full hover:bg-gray-50 border-b" },
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("div", { className: "text-gray-500" },
                        "TX-",
                        tx?.account.index.toNumber()),
                    React.createElement("div", { className: "text-gray-800 font-medium" },
                        React.createElement("div", { className: "inline-flex" }, instructions?.map(({ ix }, i) => (React.createElement(React.Fragment, { key: i },
                            React.createElement(IXSummary, { instruction: ix }),
                            i !== instructions.length - 1 && React.createElement(React.Fragment, null, ",\u00A0")))) ?? "--"))),
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("div", { className: "text-gray-500" },
                        numSigned,
                        " / ",
                        threshold,
                        " Sigs"))));
        }))));
};
