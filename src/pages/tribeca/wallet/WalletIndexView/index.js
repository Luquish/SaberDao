import React from "react";
import { usePubkey } from "@rockooor/sail";
import { SmartWalletProvider } from "../../../../hooks/tribeca/useSmartWallet";
import { SmartWalletInner } from "./SmartWalletInner";
export const WalletIndexView = ({ params }) => {
    const walletKey = usePubkey(params.walletKey);
    if (!walletKey) {
        return React.createElement("div", null, "Invalid wallet key");
    }
    return (React.createElement(SmartWalletProvider, { initialState: walletKey },
        React.createElement(SmartWalletInner, null)));
};
// Export the component as default for Gatsby pages
export default WalletIndexView;
