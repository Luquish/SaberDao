import { Switch } from "@headlessui/react";
import { useState } from "react";
import React from 'react';
import { useGovWindowTitle } from "@/hooks/tribeca/useGovernor";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { ProposalsList } from "../../../GovernanceOverviewView/nft-voter/ProposalsList";
import { ProposalBadgeWrapper } from "@/pages/tribeca/governance/GovernanceOverviewView/nft-voter/ProposalsList/ProposalCard";
import { LegendsNeverDie } from "./LegendsNeverDie";
export const ProposalsListView = () => {
    const [showDrafts, setShowDrafts] = useState(false);
    useGovWindowTitle(`Proposals`);
    return (React.createElement(GovernancePage, { title: "Governance Proposals", right: React.createElement(LegendsNeverDie, null) },
        React.createElement(Card, { title: React.createElement("div", { className: "flex w-full items-center justify-between" },
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("h2", null, "All Proposals")),
                React.createElement(ProposalBadgeWrapper, null,
                    React.createElement(Switch.Group, null,
                        React.createElement("div", { className: "flex items-center text-sm" },
                            React.createElement(Switch, { checked: showDrafts, onChange: setShowDrafts, className: `relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showDrafts ? "bg-primary" : "bg-warmGray-600"}` },
                                React.createElement("span", { className: `inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showDrafts ? "translate-x-6" : "translate-x-1"}` })),
                            React.createElement(Switch.Label, { className: "ml-2 font-medium text-warmGray-400" }, "Show Drafts"))))) },
            React.createElement(ProposalsList, { showDrafts: showDrafts }))));
};
