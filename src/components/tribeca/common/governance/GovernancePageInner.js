import { BsArrowLeft } from "react-icons/bs";
import { Link } from "gatsby";
import React from "react";
import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { ImageWithFallback } from "../ImageWithFallback";
import { Footer } from "./Footer";
export const GovernancePageInner = ({ title, header, right, preContent, children, contentStyles, containerStyles, hideDAOName = false, backLink, }) => {
    const { daoName, iconURL } = useGovernor();
    return (React.createElement("div", { className: "w-full" },
        React.createElement("div", { className: "bg-warmGray-900 pb-24" },
            React.createElement("div", { className: "h-6 mx-auto w-11/12 max-w-7xl mb-4" }, !hideDAOName && (React.createElement("div", { className: "flex items-center gap-2 text-sm font-semibold text-white" },
                React.createElement(ImageWithFallback, { src: iconURL, size: 24, alt: `Icon for ${daoName ?? "DAO"}` }),
                React.createElement("span", null,
                    daoName,
                    " Governance")))),
            React.createElement(PageContainer, { className: "w-11/12", style: containerStyles },
                React.createElement("div", { className: "flex flex-col md:flex-row gap-4 md:gap-8 md:min-h-[120px] flex-wrap items-center justify-between w-full" },
                    React.createElement("div", { className: "flex flex-col self-start md:self-center" },
                        backLink && (React.createElement(Link, { to: backLink.href, className: "flex items-center gap-2 uppercase font-bold mb-7 hover:text-white" },
                            React.createElement(BsArrowLeft, { className: "w-5 h-5" }),
                            React.createElement("span", { className: "leading-none text-sm tracking-tighter" }, backLink.label))),
                        typeof title === "string" ? (React.createElement("h1", { className: "text-2xl md:text-3xl font-bold text-white tracking-tighter" }, title)) : (title),
                        header),
                    right && React.createElement("div", null, right)),
                preContent && React.createElement("div", { className: "mt-8" }, preContent))),
        React.createElement(PageContainer, { style: containerStyles },
            React.createElement("main", { className: "w-full -mt-16 mb-20", style: contentStyles }, children)),
        React.createElement(Footer, null)));
};
export const PageContainer = ({ children, style, className = "" }) => (React.createElement("div", { className: `max-w-5xl w-full md:w-11/12 mx-auto ${className}`, style: style }, children));
