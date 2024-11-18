import React from "react";
import { FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, } from "react-icons/fa";
import clsx from "clsx";
const COLORS = {
    warning: "#ffdc00",
    danger: "#ff0033",
    info: "#60a5fa", // Tailwind blue-400
};
export function Alert({ className, children, type = "warning" }) {
    const iconStyles = "h-6 w-6";
    return (React.createElement("div", { className: clsx("grid gap-6 p-6 bg-warmGray-800 rounded text-gray-300", "grid-cols-[24px,1fr]", className), style: { borderTop: `4px solid ${COLORS[type]}` } },
        type === "info" && (React.createElement(FaInfoCircle, { className: iconStyles, style: { color: COLORS[type] } })),
        type === "warning" && (React.createElement(FaExclamationTriangle, { className: clsx(iconStyles, "mt-1"), style: { color: COLORS[type] } })),
        type === "danger" && (React.createElement(FaExclamationCircle, { className: clsx(iconStyles, "mt-1"), style: { color: COLORS[type] } })),
        React.createElement("div", { className: "[&>h2]:text-base [&>h2]:leading-normal [&>h2]:mb-2 [&>h2]:font-semibold [&>h2]:text-white" }, children)));
}
