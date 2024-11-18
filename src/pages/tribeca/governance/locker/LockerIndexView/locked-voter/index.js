import { Link } from "gatsby";
import React from "react";
import { useGovernor, useGovWindowTitle, } from "@/hooks/tribeca/useGovernor";
import { Button } from "@/components/tribeca/common/Button";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GovernancePage } from "@/components/tribeca/common/governance/GovernancePage";
import { EscrowInfo } from "./EscrowInfo";
import { LockerSnapshotsBasic } from "./LockerSnapshotsBasic";
import { LockupDetails } from "./LockupDetails";
export const LockerIndexView = () => {
    const { path } = useGovernor();
    useGovWindowTitle(`Locker`);
    return (React.createElement(GovernancePage, { title: "Vote Locker" },
        React.createElement("div", { className: "flex flex-wrap md:flex-nowrap gap-4 items-start" },
            React.createElement("div", { className: "w-full md:basis-[300px] flex flex-col gap-4 flex-shrink-0" },
                React.createElement(EscrowInfo, null),
                React.createElement(Card, null,
                    React.createElement("div", { className: "px-7 py-5" },
                        React.createElement(Link, { to: `/tribeca${path}/proposals/create` },
                            React.createElement(Button, { size: "md", className: "w-full", variant: "primary" }, "Create Proposal"))))),
            React.createElement("div", { className: "flex-grow[2] flex flex-col gap-4" },
                React.createElement(LockupDetails, null),
                React.createElement(LockerSnapshotsBasic, null)))));
};
