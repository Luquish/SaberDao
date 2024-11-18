import { GiTumbleweed } from "react-icons/gi";
import { AddressLink } from "../AddressLink";
import { EmptyState } from "../EmptyState";
import React from "react";
export const NoPrograms = ({ smartWallet }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(EmptyState, { icon: React.createElement(GiTumbleweed, null), title: "This DAO doesn't own any programs." },
            React.createElement("div", { className: "text-center" },
                React.createElement("p", null,
                    "The DAO at address ",
                    React.createElement(AddressLink, { address: smartWallet, showCopy: true }),
                    " ",
                    "does not own any programs."),
                React.createElement("p", null,
                    React.createElement("a", { className: "text-primary", href: "https://docs.solana.com/cli/deploy-a-program#set-a-programs-upgrade-authority", target: "_blank", rel: "noreferrer" }, "Read the Solana Wiki to learn more about upgrade authorities."))))));
};
