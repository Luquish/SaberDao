import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { CardErrorBoundary } from "../CardErrorBoundary";
export const Card = ({ className, title, titleStyles, children, link, padded = false, bodyScrollX = false, titleClassName, }) => {
    return (React.createElement("div", { className: clsx("rounded bg-warmGray-850 shadow-xl flex flex-col", className) },
        title && (React.createElement("div", { className: clsx("h-16 flex items-center px-7 w-full text-white font-bold tracking-tight border-b border-warmGray-800", titleClassName), style: titleStyles }, typeof title === "string" ? React.createElement("h2", null, title) : title)),
        React.createElement(CardErrorBoundary, null,
            React.createElement("div", { className: clsx(padded && "px-7 py-4", bodyScrollX && "overflow-x-auto") }, children)),
        link &&
            (link.href ? (React.createElement(Link, { to: link.href, className: "text-white hover:text-primary" },
                React.createElement("div", { className: "flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-warmGray-800" }, link.title))) : (React.createElement("div", { className: "flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-warmGray-800 text-warmGray-600 cursor-not-allowed" }, link.title)))));
};
