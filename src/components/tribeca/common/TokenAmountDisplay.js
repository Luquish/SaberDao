import React from "react";
import clsx from "clsx";
import { formatDisplayWithSoftLimit, formatPercent } from "../../../utils/tribeca/format";
import { TokenIcon } from "./TokenIcon";
export function TokenAmountDisplay({ amount, token = amount.token, isMonoNumber = false, showIcon = false, showSymbol = true, percent, className, suffix = "", exact = false, }) {
    return (React.createElement("div", { className: clsx("flex items-center", className) },
        showIcon && (React.createElement(TokenIcon, { className: "mr-1", token: token })),
        React.createElement("span", { className: clsx(isMonoNumber && "font-mono") }, exact
            ? amount.toExact({ groupSeparator: "," })
            : formatDisplayWithSoftLimit(amount.asNumber, token.decimals)),
        showSymbol && (React.createElement("span", null,
            "\u00A0",
            token.symbol)),
        percent && React.createElement("span", { className: "ml-1" },
            "(",
            formatPercent(percent),
            ")"),
        suffix && React.createElement("span", null, suffix)));
}
