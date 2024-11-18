import { Link } from "gatsby";
import React from "react";
import { Button } from "../../../../../components/tribeca/common/Button";
export const DAOStep1IntroView = () => {
    return (React.createElement("div", { className: "grid gap-12 w-full max-w-sm mx-auto" },
        React.createElement("div", null,
            React.createElement("div", { className: "mb-8" },
                React.createElement("h1", { className: "font-bold text-3xl mb-4 dark:text-gray-50" }, "Let's create a DAO."),
                React.createElement("h2", { className: "text-secondary font-medium text-sm dark:text-gray-300" }, "Tribeca allows you to create a powerful DAO with incentives for long-term alignment out of the box.")),
            React.createElement("div", { className: "flex flex-col items-center gap-16" },
                React.createElement("div", { className: "prose prose-sm dark:prose-light" },
                    React.createElement("p", null, "This wizard will take you through creating the components our recommended setup:"),
                    React.createElement("ul", null,
                        React.createElement("li", null, "A Governance Smart Wallet, with three signers:"),
                        React.createElement("li", null,
                            "A ",
                            React.createElement("strong", null, "Tribeca DAO"),
                            ", using the Locked Voter program"),
                        React.createElement("li", null, "A 1-of-n \"Executive\" multisig, used to execute transactions"),
                        React.createElement("li", null, "An Emergency DAO multisig, which can be used to override the normal DAO proposal process when things go wrong."))),
                React.createElement("div", null,
                    React.createElement(Link, { to: "/tribeca/onboarding/dao/create-executive" },
                        React.createElement(Button, { size: "md", variant: "primary" }, "Let's go!")))))));
};
export default DAOStep1IntroView;
