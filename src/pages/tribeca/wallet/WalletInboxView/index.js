import { Notice } from "../../../../components/tribeca/common/Notice";
import { BasicPage } from "../../../../components/tribeca/common/page/BasicPage";
import React from "react";
const today = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    weekday: "long",
});
export const WalletInboxView = () => {
    return (React.createElement(BasicPage, { title: "Welcome to Goki.", description: `Today is ${today}.` },
        React.createElement(Notice, null, "Select an action on the left.")));
};
