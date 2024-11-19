import React from "react";
import { navigate } from "@reach/router";
import { usePubkey } from "@rockooor/sail";
import type { WindowLocation } from "@reach/router";

import { SmartWalletProvider } from "@/hooks/tribeca/useSmartWallet";
import WalletLayout from "@/components/tribeca/layout/WalletLayout";
import WalletSaberLockupView from "@/pages/tribeca/wallet/apps/SaberLockupView";
import VenkoBulkCreateStreamView from "@/pages/tribeca/wallet/apps/venko/VenkoBulkCreateStreamView";
import VenkoCreateStreamView from "@/pages/tribeca/wallet/apps/venko/VenkoCreateStreamView";
import VenkoIndexView from "@/pages/tribeca/wallet/apps/venko/VenkoIndexView";
import ProgramImportView from "@/pages/tribeca/wallet/programs/ProgramImportView";
import ProgramUpgradeView from "@/pages/tribeca/wallet/programs/ProgramUpgradeView";
import WalletProgramsView from "@/pages/tribeca/wallet/programs/WalletProgramsView";
import WalletTreasuryDepositView from "@/pages/tribeca/wallet/treasury/WalletTreasuryDepositView";
import WalletTreasurySendView from "@/pages/tribeca/wallet/treasury/WalletTreasurySendView";
import WalletTreasuryView from "@/pages/tribeca/wallet/treasury/WalletTreasuryView";
import TransactionView from "@/pages/tribeca/wallet/tx/TransactionView";
import TransactionIndexView from "@/pages/tribeca/wallet/tx/TransactionView/TransactionIndexView";
import TransactionSignView from "@/pages/tribeca/wallet/tx/TransactionView/TransactionSignView";
import WalletTXCreateView from "@/pages/tribeca/wallet/txs/WalletTXCreateView";
import WalletTXListView from "@/pages/tribeca/wallet/txs/WalletTXListView";
import WalletInboxView from "@/pages/tribeca/wallet/WalletInboxView";
import WalletSendsView from "@/pages/tribeca/wallet/WalletSendsView";
import WalletSettingsView from "@/pages/tribeca/wallet/WalletSettingsView";

interface WalletViewProps {
    params: {
      walletKey: string;
    };
    location: WindowLocation;
  }

const WalletView: React.FC<WalletViewProps> = ({ params, location }) => {
  const walletKeyStr = params.walletKey;
  const walletKey = usePubkey(walletKeyStr);

  React.useEffect(() => {
    if (!walletKey) {
      return;
    }

    // Handle routing based on pathname
    const path = location.pathname;
    if (path === "/") {
      navigate(`/wallets/${walletKeyStr}/inbox`);
    }
  }, [walletKey, walletKeyStr, location.pathname]);

  if (!walletKey) {
    return <div>Invalid wallet key</div>;
  }

  return (
    <SmartWalletProvider initialState={walletKey}>
      <WalletLayout>
        {/* Gatsby will handle routing based on file structure in pages directory */}
        {location.pathname.includes("/apps/venko/bulk-create") && (
          <VenkoBulkCreateStreamView />
        )}
        {location.pathname.includes("/apps/venko/create") && (
          <VenkoCreateStreamView />
        )}
        {location.pathname === "/apps/venko" && <VenkoIndexView />}
        {location.pathname.includes("/apps/saber-lockup") && (
          <WalletSaberLockupView />
        )}
        {location.pathname.includes("/propose") && <WalletTXCreateView />}
        {location.pathname.includes("/txs/") && <WalletTXListView location={location} />}
        {location.pathname.includes("/tx") && (
          <TransactionView params={{ 
            transactionSeq: location.pathname.split("/tx/")[1].split("/")[0] 
          }}>
            {location.pathname.includes("/sign") ? (
              <TransactionSignView />
            ) : (
              <TransactionIndexView />
            )}
          </TransactionView>
        )}
        {location.pathname.includes("/send") && <WalletSendsView />}
        {location.pathname.includes("/treasury/send/") && (
          <WalletTreasurySendView />
        )}
        {location.pathname.includes("/treasury/deposit") && (
          <WalletTreasuryDepositView />
        )}
        {location.pathname.includes("/programs/") &&
          location.pathname.includes("/upgrade") && <ProgramUpgradeView />}
        {location.pathname === "/programs/import" && <ProgramImportView />}
        {location.pathname === "/programs" && <WalletProgramsView />}
        {location.pathname === "/treasury" && <WalletTreasuryView />}
        {location.pathname === "/settings" && <WalletSettingsView />}
        {location.pathname === "/inbox" && <WalletInboxView />}
      </WalletLayout>
    </SmartWalletProvider>
  );
};

export default WalletView;
