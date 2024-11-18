import { Suspense } from "react";
import { Outlet } from "react-router";
import { GovernorProvider, useGovernorInfo, } from "../../../hooks/tribeca/useGovernor";
import { LoadingPage } from "../../common/LoadingPage";
import { GovernorLayout } from "../../layout/GovernorLayout";
import { GovernanceNotFoundPage } from "./GovernanceNotFoundPage";
export const GovernanceView = () => {
    const info = useGovernorInfo();
    if (info?.loading) {
        return (React.createElement("div", { tw: "flex h-full justify-center items-center" },
            React.createElement(LoadingPage, null)));
    }
    if (!info) {
        return (React.createElement(GovernorLayout, { placeholder: true },
            React.createElement(GovernanceNotFoundPage, null)));
    }
    return (React.createElement(GovernorProvider, null,
        React.createElement(GovernorLayout, null,
            React.createElement(Suspense, null,
                React.createElement(Outlet, null)))));
};
export default GovernanceView;
