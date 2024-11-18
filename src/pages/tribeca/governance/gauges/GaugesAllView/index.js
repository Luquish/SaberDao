import { RewarderProvider } from "@rockooor/react-quarry";
import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { useGM } from "../context";
import { AllGaugesInner } from "./AllGaugesInner";
export const GaugesAllView = () => {
    const { path } = useGovernor();
    const { rewarderKey } = useGM();
    const { network } = useEnvironment();
    useGovWindowTitle(`All Gauges`);
    return (React.createElement(GovernancePage, { title: "All Gauges", backLink: {
            label: "Gauges",
            href: `${path}/gauges`,
        } }, rewarderKey ? (React.createElement(RewarderProvider, { initialState: { rewarderKey, network } },
        React.createElement(AllGaugesInner, null))) : (React.createElement(Card, { title: "All Gauges" },
        React.createElement(LoadingPage, { tw: "h-96" })))));
};
export default GaugesAllView;
