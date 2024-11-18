import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { SmartWalletProvider } from "@/hooks/useSmartWallet";
import { Card } from "@/components/tribeca/common/governance/Card";
import { PendingTXs } from "./PendingTXs";
export const ExecutiveCouncilTab = () => {
    const { smartWallet } = useGovernor();
    return (React.createElement(SmartWalletProvider, { initialState: smartWallet ?? undefined },
        React.createElement("div", { tw: "flex flex-col gap-4" },
            React.createElement(Card, { title: "Pending Transactions" },
                React.createElement(PendingTXs, null)))));
};
export default ExecutiveCouncilTab;
