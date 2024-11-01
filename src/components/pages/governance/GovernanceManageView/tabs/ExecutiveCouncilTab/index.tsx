import { useGovernor } from "../../../../../../hooks/tribeca/useGovernor";
import { SmartWalletProvider } from "../../../../../../hooks/useSmartWallet";
import { Card } from "../../../../../common/governance/Card";
import { PendingTXs } from "./PendingTXs";

export const ExecutiveCouncilTab: React.FC = () => {
  const { smartWallet } = useGovernor();
  return (
    <SmartWalletProvider initialState={smartWallet ?? undefined}>
      <div tw="flex flex-col gap-4">
        <Card title="Pending Transactions">
          <PendingTXs />
        </Card>
      </div>
    </SmartWalletProvider>
  );
};

export default ExecutiveCouncilTab;
