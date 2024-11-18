import React from "react";
import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { Card } from "../../../../../components/tribeca/common/governance/Card";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { AboutSAVE } from "../common/AboutSAVE";
import { CreateSAVEForm } from "./CreateSAVEForm";
export const SAVECreateView = () => {
    const { path } = useGovernor();
    useGovWindowTitle(`Create SAVE Token`);
    return (React.createElement(GovernancePage, { backLink: {
            label: "SAVEs",
            href: `${path}/saves`,
        }, title: "Create a Class of SAVEs" },
        React.createElement("div", { className: "flex flex-col gap-8" },
            React.createElement(Card, { title: "Create SAVE" },
                React.createElement("div", null,
                    React.createElement(CreateSAVEForm, null))),
            React.createElement(AboutSAVE, null))));
};
export default SAVECreateView;
