import { useGovWindowTitle } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { MarinadeMigration } from "../../../../common/MarinadeMigration";
export const GovernanceDetailsView = () => {
    useGovWindowTitle(`Details`);
    return (React.createElement(GovernancePage, { title: "Governance Details", preContent: React.createElement(MarinadeMigration, null), hideDAOName: true }));
};
