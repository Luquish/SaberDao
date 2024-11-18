import React from "react";
import { toast } from "react-hot-toast";
export function notify({ message, description, txid, txids, env, type = "info", }) {
    // log for Sentry and other debug purposes
    const logLevel = type === "warn" ? "warn" : type === "error" ? "error" : "info";
    if (txids?.length === 1) {
        txid = txids[0];
    }
    console[logLevel](`Notify: ${message ?? "<no message>"}`, description, {
        env,
        txid,
        txids,
        type,
    });
    if (txid) {
        description = (React.createElement("div", null,
            "View Transaction:",
            " ",
            React.createElement("a", { href: `https://explorer.solana.com/tx/${txid}?cluster=${env?.toString() ?? ""}`, target: "_blank", rel: "noopener noreferrer" },
                txid.slice(0, 8),
                "...",
                txid.slice(txid.length - 8))));
    }
    else if (txids) {
        description = (React.createElement("div", null,
            "View Transactions:",
            " ",
            React.createElement("div", { className: "inline-flex gap-1" }, txids.map((txid, i) => (React.createElement("a", { key: i, href: `https://explorer.solana.com/tx/${txid}?cluster=${env?.toString() ?? ""}`, target: "_blank", rel: "noopener noreferrer" },
                "[",
                i + 1,
                "]"))))));
    }
    toast(React.createElement("div", { className: "flex flex-col text-sm gap-1" },
        React.createElement("div", { className: "font-medium" }, message),
        description && React.createElement("div", { className: "text-secondary" }, description)));
}
