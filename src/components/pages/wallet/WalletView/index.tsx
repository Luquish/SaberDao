import { usePubkey } from "@rockooor/sail";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import { SmartWalletProvider } from "../../../../hooks/useSmartWallet";
import { WalletLayout } from "../../../layout/WalletLayout";
import { WalletSaberLockupView } from "../apps/SaberLockupView";
import { VenkoBulkCreateStreamView } from "../apps/venko/VenkoBulkCreateStreamView";
import { VenkoCreateStreamView } from "../apps/venko/VenkoCreateStreamView";
import { VenkoIndexView } from "../apps/venko/VenkoIndexView";
import { ProgramImportView } from "../programs/ProgramImportView";
import { ProgramUpgradeView } from "../programs/ProgramUpgradeView";
import { WalletProgramsView } from "../programs/WalletProgramsView";
import { WalletTreasuryDepositView } from "../treasury/WalletTreasuryDepositView";
import { WalletTreasurySendView } from "../treasury/WalletTreasurySendView";
import { WalletTreasuryView } from "../treasury/WalletTreasuryView";
import { TransactionView } from "../tx/TransactionView";
import { TransactionIndexView } from "../tx/TransactionView/TransactionIndexView";
import { TransactionSignView } from "../tx/TransactionView/TransactionSignView";
import { WalletTXCreateView } from "../txs/WalletTXCreateView";
import { WalletTXListView } from "../txs/WalletTXListView";
import { WalletInboxView } from "../WalletInboxView";
import { WalletSendsView } from "../WalletSendsView";
import { WalletSettingsView } from "../WalletSettingsView";

export const WalletView: React.FC = () => {
  const { walletKey: walletKeyStr } = useParams<{ walletKey: string }>();
  const walletKey = usePubkey(walletKeyStr);
  if (!walletKey) {
    return <div>Invalid wallet key</div>;
  }
  return (
    <SmartWalletProvider initialState={walletKey}>
      <WalletLayout>
        <Routes>
          <Route
            path="apps/venko/bulk-create"
            element={<VenkoBulkCreateStreamView />}
          />
          <Route path="apps/venko/create" element={<VenkoCreateStreamView />} />
          <Route path="apps/venko" element={<VenkoIndexView />} />
          <Route path="apps/saber-lockup" element={<WalletSaberLockupView />} />
          <Route path="propose" element={<WalletTXCreateView />} />
          <Route path="txs/:listId" element={<WalletTXListView />} />
          <Route path="tx" element={<TransactionView />}>
            <Route
              path=":transactionSeq/sign"
              element={<TransactionSignView />}
            />
            <Route path=":transactionSeq" element={<TransactionIndexView />} />
          </Route>
          <Route path="send" element={<WalletSendsView />} />
          <Route
            path="treasury/send/:tokenMint"
            element={<WalletTreasurySendView />}
          />
          <Route
            path="treasury/deposit"
            element={<WalletTreasuryDepositView />}
          />
          <Route
            path="programs/:programID/upgrade"
            element={<ProgramUpgradeView />}
          />
          <Route path="programs/import" element={<ProgramImportView />} />
          <Route path="programs" element={<WalletProgramsView />} />
          <Route path="treasury" element={<WalletTreasuryView />} />
          <Route path="settings" element={<WalletSettingsView />} />
          <Route path="inbox" element={<WalletInboxView />} />
          <Route
            path="/"
            element={
              <Navigate to={`/wallets/${walletKeyStr ?? "unknown"}/inbox`} />
            }
          />
        </Routes>
      </WalletLayout>
    </SmartWalletProvider>
  );
};

export default WalletView;
