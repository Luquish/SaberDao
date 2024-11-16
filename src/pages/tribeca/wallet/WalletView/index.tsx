import React from "react";
import { navigate } from "@reach/router";
import { usePubkey } from "@rockooor/sail";
import type { WindowLocation } from "@reach/router";

import { SmartWalletProvider } from "../../../../hooks/tribeca/useSmartWallet";
import { WalletLayout } from "../../../../components/tribeca/layout/WalletLayout";
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

interface WalletViewProps {
    params: {
      walletKey: string;
    };
    location: WindowLocation;
  }

export const WalletView: React.FC<WalletViewProps> = ({ params, location }) => {
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
