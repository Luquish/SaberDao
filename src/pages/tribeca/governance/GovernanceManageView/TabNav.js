import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
export const TabNav = () => {
    const { path: rootPath, meta } = useGovernor();
    const unfilteredGroups = [
        {
            title: "General",
            path: "/",
            tabs: [
                {
                    path: "/rewarders",
                    label: "Rewarders",
                },
                {
                    path: "/gauges",
                    label: "Gauges",
                },
                {
                    path: "/executive-council",
                    label: "Executive Council",
                },
                {
                    path: "/config",
                    label: "Config",
                },
            ],
        },
        meta?.slug === "sbr" && {
            title: "Saber",
            path: "/saber",
            tabs: [
                {
                    path: "/saber/mint-proxy",
                    label: "Mint Proxy",
                },
                {
                    path: "/saber/redeemer",
                    label: "Redeemer",
                },
            ],
        },
    ];
    const groups = unfilteredGroups.filter(Boolean);
    return (React.createElement("div", null,
        React.createElement("nav", { className: "flex flex-col gap-2 bg-warmGray-850 px-3 py-2 rounded" }, groups.map(({ title, path, tabs }) => (React.createElement("div", { key: title },
            React.createElement(SidebarNavLink, { to: `/tribeca${rootPath}/manage${path}`, className: "pl-2 mb-0.5" },
                React.createElement("h2", { className: "text-white font-semibold" }, title)),
            React.createElement("div", { className: "flex flex-col gap-0.5" }, tabs.map(({ path, label }) => (React.createElement(SidebarNavLink, { to: `/tribeca${rootPath}/manage${path}`, key: path },
                React.createElement("span", null, label)))))))))));
};
const SidebarNavLink = ({ className, ...props }) => {
    return (React.createElement(Link, { ...props, className: clsx("text-warmGray-400 text-sm font-medium h-7 flex items-center px-5 rounded cursor-pointer", "hover:bg-warmGray-600 hover:text-white", "active:bg-warmGray-700 active:text-white", className), activeClassName: "active" }));
};
