import { startCase } from "lodash-es";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import React from "react";
import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";
import { ReactComponent as Rook } from "./Rook.svg";
import { SettingsModal } from "./SettingsModal";
import { WalletDropdown } from "./WalletDropdown";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    return {
        governor: paths[3] || ''
    };
}
export const Header = ({ placeholder }) => {
    const location = useLocation();
    const { governor } = getParams(location.pathname);
    const { network } = useEnvironment();
    return (React.createElement("div", { className: "bg-warmGray-900 w-screen" },
        React.createElement("div", { className: "flex items-center justify-between h-20 mx-auto w-11/12 max-w-7xl" },
            React.createElement("div", { className: "flex items-center gap-4 z-20 md:z-auto" },
                React.createElement(Link, { to: `/gov/${governor ?? ""}` },
                    React.createElement("div", { className: "text-white hover:(text-primary -rotate-3) transition-all" },
                        React.createElement(Rook, null))),
                React.createElement("div", { className: "hidden md:block" }, !placeholder && React.createElement(Nav, null))),
            React.createElement("div", { className: "flex items-center" },
                network !== "mainnet-beta" && (React.createElement("span", { className: "text-white bg-accent text-sm px-3 py-1 rounded font-semibold mr-4 z-20 md:z-auto" }, startCase(network))),
                React.createElement(WalletDropdown, null),
                !placeholder && (React.createElement(React.Fragment, null,
                    React.createElement(MobileNav, { className: "ml-4 md:hidden" }),
                    React.createElement(SettingsModal, { className: "ml-4" })))))));
};
