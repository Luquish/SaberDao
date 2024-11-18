import { Link } from "gatsby";
import React from "react";
import { useSDK } from "@/contexts/sdk";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "@/utils/tribeca/format";
import { Button } from "@/components/tribeca/common/Button";
import { EmptyStateConnectWallet } from "@/components/tribeca/common/EmptyState";
import { Card } from "@/components/tribeca/common/governance/Card";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
export const SetupVoting = ({ className }) => {
    const { govToken, veToken, daoName, lockerData, governor } = useGovernor();
    const { sdkMut } = useSDK();
    const maxStakeFmt = lockerData
        ? formatDurationSeconds(lockerData.account.params.maxStakeDuration.toNumber())
        : "--";
    return (React.createElement(Card, { title: "Setup Voting", className: className },
        !sdkMut && React.createElement(EmptyStateConnectWallet, null),
        sdkMut && (React.createElement("div", { className: "px-7 py-4 text-sm grid gap-4" },
            React.createElement("p", null,
                "Participating in ",
                daoName,
                " Governance requires that an account have a balance of vote-escrowed ",
                govToken?.symbol,
                " (",
                veToken?.symbol,
                "). participate in governance, you must lock up ",
                govToken?.name,
                " for a period of time."),
            React.createElement("p", null,
                veToken?.symbol,
                " cannot be transferred. The only way to obtain",
                " ",
                veToken?.symbol,
                " is by locking ",
                govToken?.symbol,
                ". The maximum lock time is ",
                maxStakeFmt,
                ". One ",
                govToken?.symbol,
                " locked for",
                " ",
                maxStakeFmt,
                " provides an initial balance of",
                " ",
                lockerData?.account.params.maxStakeVoteMultiplier.toString(),
                " ",
                veToken?.symbol,
                "."),
            React.createElement(ExternalLink, { href: "https://docs.tribeca.so/electorate/voting-escrow#voting-escrow-tokens" }, "Learn more"),
            React.createElement("div", null,
                React.createElement(Link, { to: `/tribeca/gov/${governor.toString()}/locker/lock` },
                    React.createElement(Button, { size: "md", variant: "primary" }, "Get Started")))))));
};
