import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
export const NavTabs = ({ options }) => (React.createElement("div", { className: "p-1 mx-auto flex gap-0.5 grid-flow-col bg-gray-100 rounded-2xl text-sm" }, options.map(({ label, path }) => {
    return (React.createElement(Link, { to: path, key: path, activeClassName: "selected", className: clsx("font-sans font-semibold px-4 py-2 rounded-2xl w-[120px] grid justify-items-center text-gray-700", "hover:bg-gray-800 hover:bg-opacity-20") },
        React.createElement("span", null, label)));
})));
