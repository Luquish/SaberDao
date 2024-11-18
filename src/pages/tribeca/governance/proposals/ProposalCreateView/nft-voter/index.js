import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { MarinadeMigration } from "../../../../../common/MarinadeMigration";
export const ProposalCreateView = () => {
    return (React.createElement(GovernancePage, { title: "Create a Proposal", preContent: React.createElement(MarinadeMigration, null), hideDAOName: true }));
};
