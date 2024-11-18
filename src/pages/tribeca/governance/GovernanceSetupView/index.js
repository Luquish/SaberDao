import { useGovernorInfo, useGovWindowTitle, } from "../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../common/governance/GovernancePage";
import { LoadingPage } from "../../../common/LoadingPage";
import { InitializeGovernanceCard } from "./InitializeGovernanceCard";
import { OnboardingChecklist } from "./OnboardingChecklist";
export const GovernanceSetupView = () => {
    const info = useGovernorInfo();
    useGovWindowTitle(`Setup`);
    return (React.createElement(GovernancePage, { title: "Initialize Governance" },
        React.createElement("div", { tw: "flex flex-col gap-4" },
            info ? React.createElement(InitializeGovernanceCard, { info: info }) : React.createElement(LoadingPage, null),
            React.createElement(OnboardingChecklist, null))));
};
export default GovernanceSetupView;
