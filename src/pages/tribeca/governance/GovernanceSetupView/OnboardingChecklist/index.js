import { GovernorProvider, useGovernorInfo, } from "../../../../../hooks/tribeca/useGovernor";
import { EmptyState } from "../../../../common/EmptyState";
import { Card } from "../../../../common/governance/Card";
import { GaugeForemanEC } from "./GaugeForemanEC";
export const OnboardingChecklist = () => {
    const info = useGovernorInfo();
    if (!info) {
        return (React.createElement(Card, { title: "Integration Status" },
            React.createElement(EmptyState, { title: "Your DAO is not yet set up." })));
    }
    return (React.createElement(GovernorProvider, null,
        React.createElement(Card, { title: "Integration Status" },
            React.createElement(GaugeForemanEC, null))));
};
