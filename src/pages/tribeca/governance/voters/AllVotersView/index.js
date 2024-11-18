import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { TopVotersCard } from "./TopVotersCard";
export const AllVotersView = () => {
    const { path } = useGovernor();
    useGovWindowTitle(`All Voters`);
    return (React.createElement(GovernancePage, { title: "Leaderboard", backLink: {
            label: "Overview",
            href: `${path}`,
        } },
        React.createElement(TopVotersCard, null)));
};
export default AllVotersView;
