import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { useWindowTitle } from "@/hooks/tribeca/useWindowTitle";
import { displayAddress } from "@/utils/tribeca/programs";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { useTransaction } from "../context";
import { Actions } from "./Actions";
import { InstructionCard } from "./InstructionCard";
import { TXActivity } from "./TXActivity";
import { TXSidebar } from "./TXSidebar";
export const TransactionIndexView = () => {
    const { key } = useSmartWallet();
    const { network } = useEnvironment();
    const { instructions, txEnv, title, id } = useTransaction();
    useWindowTitle(`[${id}] ${title} - ${displayAddress(key.toString())} | SaberDAO`);
    return (React.createElement("div", { className: "flex w-full py-2" },
        React.createElement("div", { className: "grid gap-4 flex-grow[2] flex-basis[760px]" },
            React.createElement("div", { className: "w-full px-6 max-w-3xl mx-auto" },
                React.createElement("div", { className: "pb-16" },
                    React.createElement("h2", { className: "border-b pb-2 text-gray-500 font-semibold text-sm mb-4" },
                        React.createElement(Link, { to: `/wallets/${key.toString()}/txs/all`, className: "hover:underline" }, "Transactions"),
                        " ",
                        "\u203A ",
                        id),
                    React.createElement("h1", { className: "font-medium text-2xl leading-relaxed my-4 py-2" }, title),
                    React.createElement(Actions, null),
                    React.createElement("div", { className: "grid gap-4" }, instructions?.map((instruction, i) => (React.createElement(InstructionCard, { key: `ix_${i}`, instruction: instruction, index: i }))))),
                React.createElement("div", { className: "pb-4 border-b" }, txEnv && network !== "localnet" && (React.createElement("div", null,
                    React.createElement("a", { className: "text-sm flex items-center gap-2 text-primary", href: txEnv.generateInspectLink(network), target: "_blank", rel: "noreferrer" },
                        "Preview on Anchor.so",
                        React.createElement(FaExternalLinkAlt, null))))),
                React.createElement(TXActivity, null))),
        React.createElement("div", { className: "flex-grow[1] border-l px-6" },
            React.createElement(TXSidebar, null))));
};
