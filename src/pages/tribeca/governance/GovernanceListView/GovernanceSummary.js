import { Link } from "gatsby";
import React from "react";
import { useGovernorVoters } from "../voters/AllVotersView/useVotersList";
export const GovernanceSummary = ({ config }) => {
    const { data: voters } = useGovernorVoters(config.address);
    return (React.createElement("div", { className: "border border-warmGray-800 bg-warmGray-850 px-7 py-5 rounded" },
        React.createElement("div", { className: "flex flex-col gap-4" },
            React.createElement("div", { className: "flex items-center gap-4" },
                React.createElement("img", { src: config.iconURL, alt: `Icon of ${config.name}`, className: "w-8 h-8" }),
                React.createElement("h2", { className: "text-xl font-bold text-white" },
                    React.createElement(Link, { to: `/tribeca/gov/${config.slug}`, className: "hover:text-primary transition-colors" }, config.name))),
            React.createElement("p", null, config.description),
            React.createElement("p", null,
                voters?.count,
                " Members"),
            React.createElement("p", null,
                voters?.totalVotes.toLocaleString(),
                " ve",
                config.govToken.symbol))));
};
