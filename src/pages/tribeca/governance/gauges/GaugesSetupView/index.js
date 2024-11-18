import { useGovWindowTitle } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { SetupGaugesCard } from "./SetupGaugesCard";
export const GaugesSetupView = () => {
    useGovWindowTitle(`Setup Gauges`);
    return (React.createElement(GovernancePage, { title: "Setup Gauges" },
        React.createElement("div", { tw: "flex flex-col gap-4" },
            React.createElement(SetupGaugesCard, null))));
};
export default GaugesSetupView;
