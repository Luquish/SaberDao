import { WalletButton } from "../layout/GovernorLayout/Header/WalletButton";
import { ReactComponent as SolanaIcon } from "../layout/WalletLayout/SolanaIcon.svg";
import React from 'react';
export const EmptyState = ({ icon, title, children, className, }) => {
    return (React.createElement("div", { className: `w-full py-12 text-sm flex flex-col items-center ${className}` },
        icon && (React.createElement("div", { className: "w-20 h-20 mb-3" }, icon)),
        React.createElement("div", { className: "h-6" },
            React.createElement("span", { className: "text-secondary dark:text-coolGray-300" }, title)),
        React.createElement("div", null, children)));
};
export const EmptyStateConnectWallet = (props) => {
    return (React.createElement(EmptyState, { icon: React.createElement(SolanaIcon, null), title: "Connect your wallet to view this page.", ...props },
        React.createElement("div", { className: "mt-4" },
            React.createElement(WalletButton, null))));
};
