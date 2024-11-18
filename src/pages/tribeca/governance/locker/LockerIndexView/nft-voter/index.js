import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { MarinadeMigration } from "../../../../../common/MarinadeMigration";
export const LockerIndexView = () => {
    useGovWindowTitle(`Locker`);
    return (React.createElement(GovernancePage, { title: "Vote Locker", preContent: React.createElement(MarinadeMigration, null), hideDAOName: true }));
};
