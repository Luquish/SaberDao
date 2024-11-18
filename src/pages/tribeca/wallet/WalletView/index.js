import React from "react";
import { navigate } from "@reach/router";
import { usePubkey } from "@rockooor/sail";
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
export const WalletView = ({ params, location }) => {
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
        return React.createElement("div", null, "Invalid wallet key");
    }
    return (React.createElement(SmartWalletProvider, { initialState: walletKey },
        React.createElement(WalletLayout, null,
            location.pathname.includes("/apps/venko/bulk-create") && (React.createElement(VenkoBulkCreateStreamView, null)),
            location.pathname.includes("/apps/venko/create") && (React.createElement(VenkoCreateStreamView, null)),
            location.pathname === "/apps/venko" && React.createElement(VenkoIndexView, null),
            location.pathname.includes("/apps/saber-lockup") && (React.createElement(WalletSaberLockupView, null)),
            location.pathname.includes("/propose") && React.createElement(WalletTXCreateView, null),
            location.pathname.includes("/txs/") && React.createElement(WalletTXListView, { location: location }),
            location.pathname.includes("/tx") && (React.createElement(TransactionView, { params: {
                    transactionSeq: location.pathname.split("/tx/")[1].split("/")[0]
                } }, location.pathname.includes("/sign") ? (React.createElement(TransactionSignView, null)) : (React.createElement(TransactionIndexView, null)))),
            location.pathname.includes("/send") && React.createElement(WalletSendsView, null),
            location.pathname.includes("/treasury/send/") && (React.createElement(WalletTreasurySendView, null)),
            location.pathname.includes("/treasury/deposit") && (React.createElement(WalletTreasuryDepositView, null)),
            location.pathname.includes("/programs/") &&
                location.pathname.includes("/upgrade") && React.createElement(ProgramUpgradeView, null),
            location.pathname === "/programs/import" && React.createElement(ProgramImportView, null),
            location.pathname === "/programs" && React.createElement(WalletProgramsView, null),
            location.pathname === "/treasury" && React.createElement(WalletTreasuryView, null),
            location.pathname === "/settings" && React.createElement(WalletSettingsView, null),
            location.pathname === "/inbox" && React.createElement(WalletInboxView, null))));
};
export default WalletView;
