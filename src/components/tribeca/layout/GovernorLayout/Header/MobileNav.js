import { useState } from "react";
import { FaGripLines } from "react-icons/fa";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { useNavLinks } from "./Nav";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    return {
        governor: paths[3] || ''
    };
}
export const MobileNav = ({ className }) => {
    const location = useLocation();
    const { governor } = getParams(location.pathname);
    const [showNav, setShowNav] = useState(false);
    const navLinks = useNavLinks();
    return (React.createElement("div", { className: className },
        React.createElement("div", { className: clsx("fixed left-0 bottom-0 h-screen w-screen bg-warmGray-900 transition-all z-10", "h-[calc(100vh-80px)]", !showNav && "opacity-0 pointer-events-none", !showNav && "translate-y-[-100%] duration-500 ease-in-out", showNav && "translate-y-0 opacity-100", "flex flex-col") },
            React.createElement("div", { className: "flex flex-grow items-center justify-center" },
                React.createElement("div", { className: "flex flex-col items-center font-bold text-base text-white" }, navLinks.map(({ title, href }) => (React.createElement(Link, { key: href, to: `/gov/${governor ?? ""}${href}`, className: "py-5", onClick: () => {
                        setShowNav(false);
                    }, getProps: ({ isCurrent }) => ({
                        className: isCurrent ? "selected" : ""
                    }) },
                    React.createElement("div", null, title))))))),
        React.createElement("button", { className: "z-20 relative", onClick: () => {
                setShowNav((res) => !res);
            } },
            React.createElement(FaGripLines, null))));
};
