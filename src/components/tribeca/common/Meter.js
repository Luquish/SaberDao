import { Fraction } from "@saberhq/token-utils";
import React from "react";
export const Meter = ({ value, max, barColor, className, }) => {
    const width = typeof value === "number" && typeof max === "number"
        ? value / max
        : new Fraction(value, max).asNumber;
    return (React.createElement("div", { className: "flex-grow bg-warmGray-700 h-1 rounded" },
        React.createElement("div", { style: {
                width: `${Math.min(width, 1) * 100}%`,
                backgroundColor: barColor,
            }, className: "bg-primary h-1 rounded transition-all" })));
};
