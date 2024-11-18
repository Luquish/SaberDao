import React from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { SubscriptionPopover } from "./SubscriptionPopover";
import { WalletDisconnected } from "./WalletDisconnected";
const WalletDisconnectedPopover = () => {
    return (React.createElement(SubscriptionCard, { body: React.createElement("div", { className: "w-full min-height[16rem] flex flex-col align-items[center] justify-content[center]" },
            React.createElement(WalletDisconnected, { className: "w-8 h-8" }),
            React.createElement("span", { className: "text-lg text-secondary text-align[center]" }, "No wallet connected")) }));
};
const WalletUnsupportedPopover = () => {
    return (React.createElement(SubscriptionCard, { body: React.createElement("div", { className: "w-full min-height[16rem] flex flex-col align-items[center] justify-content[center]" },
            React.createElement("span", { className: "text-lg text-white text-align[center]" }, "Unsupported wallet"),
            React.createElement("span", { className: "text-secondary text-align[center]" }, "Supported wallets include Phantom, Solflare, and Slope")) }));
};
export const SubscriptionPopoverContainer = ({ daoName, governor, walletPublicKey, signer, }) => {
    if (walletPublicKey === null) {
        return React.createElement(WalletDisconnectedPopover, null);
    }
    if (signer === null) {
        return React.createElement(WalletUnsupportedPopover, null);
    }
    return (React.createElement(SubscriptionPopover, { daoName: daoName, governor: governor, walletPublicKey: walletPublicKey, signer: signer }));
};
