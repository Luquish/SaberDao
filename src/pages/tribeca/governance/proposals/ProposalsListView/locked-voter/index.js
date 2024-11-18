import { Switch } from "@headlessui/react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { useGovernor, useGovWindowTitle, } from "@/hooks/tribeca/useGovernor";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { ProposalsList } from "../../../GovernanceOverviewView/locked-voter/ProposalsList";
import { LegendsNeverDie } from "./LegendsNeverDie";
export const ProposalsListView = () => {
    const { path } = useGovernor();
    const [showDrafts, setShowDrafts] = useState(false);
    useGovWindowTitle(`Proposals`);
    return (React.createElement(GovernancePage, { title: "Governance Proposals", right: React.createElement(LegendsNeverDie, null) },
        React.createElement(Card, { title: React.createElement("div", { className: "flex w-full items-center justify-between" },
                React.createElement("div", { className: "flex items-center gap-4" },
                    React.createElement("h2", null, "All Proposals"),
                    React.createElement(Link, { to: `/tribeca${path}/proposals/create`, className: "pt-0.5 flex items-center text-primary hover:text-white transition-all" },
                        React.createElement("button", null,
                            React.createElement(FaPlusCircle, null)))),
                React.createElement("div", { className: "flex gap-4 w-auto md:w-[140px] md:justify-end" },
                    React.createElement(Switch.Group, null,
                        React.createElement("div", { className: "flex items-center text-sm" },
                            React.createElement(Switch, { checked: showDrafts, onChange: setShowDrafts, className: clsx("relative inline-flex items-center h-6 rounded-full w-11 transition-colors", showDrafts ? "bg-primary" : "bg-warmGray-600") },
                                React.createElement("span", { className: clsx("inline-block w-4 h-4 transform bg-white rounded-full transition-transform", showDrafts ? "translate-x-6" : "translate-x-1") })),
                            React.createElement(Switch.Label, { className: "ml-2 font-medium text-warmGray-400" }, "Show Drafts"))))) },
            React.createElement(ProposalsList, { showDrafts: showDrafts }))));
};
