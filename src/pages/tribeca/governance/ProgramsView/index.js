import { Card } from "../../../common/governance/Card";
import { GovernancePage } from "../../../common/governance/GovernancePage";
import { ProgramsList } from "./ProgramsList";
export const ProgramsView = () => {
    return (React.createElement(GovernancePage, { title: "Programs" },
        React.createElement(Card, { title: React.createElement("div", { tw: "flex w-full items-center justify-between" },
                React.createElement("div", { tw: "flex items-center gap-4" },
                    React.createElement("h2", null, "Manage Programs"))) },
            React.createElement(ProgramsList, null))));
};
export default ProgramsView;
