import { useWallet } from "@solana/wallet-adapter-react";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as React from "react";
import { FaChevronDown } from "react-icons/fa";
const LABELS = {
    "change-wallet": "Change wallet",
    connecting: "Connecting ...",
    "copy-address": "Copy address",
    copied: "Copied",
    disconnect: "Disconnect",
    "has-wallet": "Connect Wallet",
    "no-wallet": (React.createElement("div", null,
        "Connect",
        React.createElement("span", { className: "no-mobile" }, " Wallet"))),
};
export const WalletButton = () => {
    const { publicKey } = useWallet();
    return (React.createElement("div", null,
        React.createElement(BaseWalletMultiButton
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        , { 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            labels: LABELS }, publicKey ? (React.createElement(FaChevronDown, { className: "text-black/80 dark:text-slate-200/80" })) : null)));
};
