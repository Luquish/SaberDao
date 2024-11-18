import { Router } from "@reach/router";
import { Link } from "gatsby";
import React from "react";
import { useExecutiveCouncil } from "../../../../hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { Button } from "../../../../components/tribeca/common/Button";
import { Card } from "../../../../components/tribeca/common/governance/Card";
import { GovernancePage } from "../../../../components/tribeca/common/governance/GovernancePage";
import { TabNav } from "./TabNav";
export const GovernanceManageView = () => {
    const { path, daoName } = useGovernor();
    const { isMemberOfEC } = useExecutiveCouncil();
    return (React.createElement(GovernancePage, { title: "Manage", containerClassName: "max-w-7xl" }, isMemberOfEC ? (React.createElement("div", { className: "flex flex-col md:flex-row gap-8" },
        React.createElement(TabNav, null),
        React.createElement("div", { className: "flex-1" },
            React.createElement(Router, null)))) : (React.createElement(Card, { title: "Unauthorized", padded: true },
        React.createElement("div", { className: "flex flex-col items-center gap-4 my-4" },
            React.createElement("img", { src: "/images/tribeca/unauthorized.jpeg", alt: "Stop right here." }),
            React.createElement("p", null,
                "You must be on the ",
                daoName,
                " Executive Council to view this page."),
            React.createElement(Link, { to: `/tribeca${path}` },
                React.createElement(Button, null, "Return to Home")))))));
};
export default GovernanceManageView;
