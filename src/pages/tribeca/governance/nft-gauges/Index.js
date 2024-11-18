import { useGovWindowTitle } from "../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../common/governance/GovernancePage";
import { MarinadeMigration } from "../../../common/MarinadeMigration";
const Index = ({ label }) => {
    useGovWindowTitle(`${label} Gauges`);
    return (React.createElement(GovernancePage, { title: `${label} Gauges`, preContent: React.createElement(MarinadeMigration, null), hideDAOName: true }));
};
export default Index;
