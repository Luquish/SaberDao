import { BasicPage } from "../../../../components/tribeca/common/page/BasicPage";
import { SignersSection } from "./SignersSection";
import { SubaccountsSection } from "./SubaccountsSection";
import React from "react";
export const WalletSettingsView = () => {
    return (React.createElement(BasicPage, { title: "Settings", description: "Manage your smart wallet settings" },
        React.createElement("div", { className: "flex flex-col gap-12" },
            React.createElement(SignersSection, null),
            React.createElement(SubaccountsSection, null))));
};
