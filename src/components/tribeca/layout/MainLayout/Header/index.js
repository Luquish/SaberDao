import { startCase } from "lodash-es";
import React from "react";
import { Link } from "gatsby";
import { CURRENT_APP } from "../../../../../config";
import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { ReactComponent as GokiIcon } from "../../../../common/svgs/Icon.svg";
import { ReactComponent as GokiLogo } from "../../../../common/svgs/logo-dark.svg";
import { ReactComponent as TribecaIcon } from "../../../common/svgs/tribeca/favicon.svg";
import { ReactComponent as TribecaLogo } from "../../../common/svgs/tribeca/logo.svg";
import { WalletDropdown } from "../../GovernorLayout/Header/WalletDropdown";
import { MoreInfo } from "./MoreInfo";
const Logo = CURRENT_APP === "tribeca" ? TribecaLogo : GokiLogo;
const Icon = CURRENT_APP === "tribeca" ? TribecaIcon : GokiIcon;
export const Header = () => {
    const { network } = useEnvironment();
    return (React.createElement("div", { className: "relative flex items-center justify-between py-4 md:py-12" },
        React.createElement("div", { className: "z-50 flex items-center" },
            React.createElement("div", { className: "flex items-center" },
                React.createElement(Link, { to: "/", className: "hidden md:block h-6 w-36 hover:-rotate-3 transition-all" },
                    React.createElement(Logo, { className: "text-primary-800 hover:text-primary dark:(text-primary hover:text-white) h-full w-full transition-colors" })),
                React.createElement(Link, { to: "/", className: "md:hidden h-10 hover:-rotate-3 transition-all" },
                    React.createElement(Icon, { className: "text-primary-800 hover:text-primary dark:(text-primary hover:text-white) h-full w-full transition-colors" })))),
        React.createElement("div", { className: "flex justify-end items-center z-20 gap-4" },
            network !== "mainnet-beta" && (React.createElement("span", { className: "bg-accent px-3 py-0.5 text-xs rounded text-white font-medium" }, startCase(network))),
            React.createElement(WalletDropdown, null),
            React.createElement(MoreInfo, null))));
};
