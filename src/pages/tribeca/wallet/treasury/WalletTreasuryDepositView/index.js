import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { EmptyStateConnectWallet } from "../../../../../components/tribeca/common/EmptyState";
import { BasicPage } from "../../../../../components/tribeca/common/page/BasicPage";
import { WalletTreasuryDepositInner } from "./WalletTreasuryDepositInner";
import React from "react";
export const WalletTreasuryDepositView = () => {
    const wallet = useAnchorWallet();
    return (React.createElement(BasicPage, { title: "Deposit funds", description: "Deposit tokens into your wallet's treasury." }, !wallet ? React.createElement(EmptyStateConnectWallet, null) : React.createElement(WalletTreasuryDepositInner, null)));
};
