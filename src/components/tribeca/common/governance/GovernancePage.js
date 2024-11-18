import { useGovernor, useGovernorInfo, } from "../../../../hooks/tribeca/useGovernor";
import { GovernanceNotFoundPage } from "../../../../pages/tribeca/governance/GovernanceNotFoundPage";
import { LoadingPage } from "../LoadingPage";
import { GovernancePageInner } from "./GovernancePageInner";
import React from "react";
export const GovernancePage = ({ ...props }) => {
    const info = useGovernorInfo();
    const { governorData } = useGovernor();
    if (!info || governorData === null) {
        return React.createElement(GovernanceNotFoundPage, null);
    }
    if (info?.loading) {
        return React.createElement(LoadingPage, null);
    }
    return React.createElement(GovernancePageInner, { ...props });
};
