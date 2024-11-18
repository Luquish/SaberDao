import { useTribecaRegistry } from "../../../../hooks/api/useTribecaRegistry";
import { GovernanceSummary } from "./GovernanceSummary";
export const GovernanceListView = () => {
    const { data: registry } = useTribecaRegistry();
    return (React.createElement("div", null,
        React.createElement("h1", { tw: "font-bold text-3xl mb-4 dark:text-gray-50" }, "All DAOs"),
        registry?.map((config) => (React.createElement(GovernanceSummary, { key: config.address.toString(), config: config })))));
};
export default GovernanceListView;
