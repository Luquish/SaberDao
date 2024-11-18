import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { BasicSection } from "../../../../../components/tribeca/common/page/Section";
import { Tokens } from "./Tokens";
import React from "react";
export const WalletTreasuryView = () => {
    return (React.createElement(BasicPage, { title: "Treasury Management", description: "Manage your tokens and staking positions" },
        React.createElement("div", { className: "grid gap-12" },
            React.createElement(BasicSection, { title: "Assets" },
                React.createElement(Tokens, null)),
            React.createElement(BasicSection, { title: "Farms", description: "(coming soon) Manage your yield farming positions." }))));
};
