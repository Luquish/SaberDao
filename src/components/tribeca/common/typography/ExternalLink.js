import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
export const ExternalLink = ({ children, noIcon = false, icon, className, ...anchorProps }) => {
    return (React.createElement("a", { className: clsx("text-sm text-primary hover:text-white transition-colors", className), target: "_blank", rel: "noreferrer", ...anchorProps },
        children,
        !noIcon &&
            (icon ?? (React.createElement(FaExternalLinkAlt, { className: "ml-2 inline align-baseline h-[0.8em] w-[0.8em]" })))));
};
export const InternalLink = ({ children, className, ...props }) => {
    return (React.createElement(Link, { className: clsx("text-sm flex items-center gap-2 text-primary hover:text-white transition-colors", className), ...props }, children));
};
