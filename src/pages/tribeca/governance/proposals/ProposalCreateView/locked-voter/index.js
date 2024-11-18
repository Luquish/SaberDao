import React from 'react';
import { useSDK } from "@/contexts/sdk";
import { EmptyStateConnectWallet } from "@/components/tribeca/common/EmptyState";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { ProposalCreateInner } from "./ProposalCreateInner";
export const ProposalCreateView = () => {
    const { sdkMut } = useSDK();
    return (React.createElement(GovernancePage, { title: "Create a Proposal", containerClassName: "w-11/12 md:w-full max-w-7xl mx-auto" }, sdkMut ? (React.createElement(ProposalCreateInner, null)) : (React.createElement(Card, { title: "Proposal Info" },
        React.createElement(EmptyStateConnectWallet, null)))));
};
