import { startCase } from "lodash-es";
import { AiOutlineBank } from "react-icons/ai";
import { FaCode, FaInbox, FaWrench } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import { useSmartWallet } from "../../../../../hooks/tribeca/useSmartWallet";
import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { AddressLink } from "../../../common/AddressLink";
import { ReactComponent as GokiLogo } from "../../../common/svgs/logo-dark.svg";
import { WalletDropdownMini } from "../WalletDropdownMini";
import { SidebarNavLink } from "./SidebarNavLink";
const MAIN_LINKS = [
    {
        icon: React.createElement(FaInbox, null),
        title: "Inbox",
        href: "/inbox",
    },
    {
        icon: React.createElement(AiOutlineBank, null),
        title: "Treasury",
        href: "/treasury",
    },
    {
        icon: React.createElement(FaCode, null),
        title: "Programs",
        href: "/programs",
    },
    {
        icon: React.createElement(FaWrench, null),
        title: "Settings",
        href: "/settings",
    },
];
const NAV_LINKS = [
    {
        title: "All",
        href: "/txs/all",
    },
    {
        title: "Pending",
        href: "/txs/pending",
    },
    {
        title: "Executed",
        href: "/txs/executed",
    },
];
const APPS = [
// {
//   title: "✌️ Venko",
//   href: "/apps/venko",
// },
];
export const Sidebar = () => {
    const { key, path } = useSmartWallet();
    const { network } = useEnvironment();
    return (React.createElement("nav", { className: "w-[220px] max-w-[330px] h-screen border-r flex flex-col justify-between flex-grow-0 flex-shrink-0" },
        React.createElement("div", null,
            React.createElement("div", { className: "px-5 py-3 grid gap-7" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement(Link, { to: path },
                        React.createElement(GokiLogo, { className: "h-5 w-min text-primary-800 hover:(text-primary -rotate-3) transition-all" })),
                    network !== "mainnet-beta" && (React.createElement("span", { className: "bg-accent-500 text-white px-3 py-0.5 rounded text-xs" }, startCase(network)))),
                React.createElement("div", { className: "border rounded px-3 py-2 text-sm flex items-center gap-1" },
                    React.createElement("span", null, "Wallet:"),
                    React.createElement(AddressLink, { className: "font-semibold", address: key, showCopy: true, showRaw: false }))),
            React.createElement("div", { className: "flex flex-col px-4 mb-0.5 gap-7" },
                React.createElement("div", { className: "flex flex-col" }, MAIN_LINKS.map(({ title, href, icon }) => {
                    return (React.createElement(SidebarNavLink, { key: href, to: `/wallets/${key.toString()}${href}`, className: "px-2" },
                        React.createElement("div", { className: "flex items-center gap-2" },
                            icon,
                            title)));
                })),
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("h3", { className: "text-xs font-medium text-gray-500 mb-1 px-2" }, "Transactions"),
                    NAV_LINKS.map(({ title, href }) => {
                        return (React.createElement(SidebarNavLink, { key: href, to: `/wallets/${key.toString()}${href}` }, title));
                    })),
                APPS.length > 0 && (React.createElement("div", { className: "flex flex-col" },
                    React.createElement("h3", { className: "text-xs font-medium text-gray-500 mb-1 px-2" }, "Apps"),
                    APPS.map(({ title, href }) => {
                        return (React.createElement(SidebarNavLink, { key: href, to: `/wallets/${key.toString()}${href}` }, title));
                    }))))),
        React.createElement("div", { className: "px-5 py-3 mb-3" },
            React.createElement(WalletDropdownMini, null))));
};
