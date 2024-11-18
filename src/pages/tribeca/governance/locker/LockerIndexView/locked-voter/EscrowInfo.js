import { useToken, useUserATAs } from "@rockooor/sail";
import { navigate } from "@reach/router";
import { useLocation } from "@reach/router";
import { Link } from "gatsby";
import React from "react";
import { useSDK } from "@/contexts/sdk";
import { useLocker, useUserEscrow, } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Button } from "@/components/tribeca/common/Button";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { Card } from "@/components/tribeca/common/governance/Card";
import { TokenAmountDisplay } from "@/components/tribeca/common/TokenAmountDisplay";
import { TokenIcon } from "@/components/tribeca/common/TokenIcon";
import { CardItem } from "./CardItem";
import { LockEscrowModal } from "./LockEscrowModal";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    const lockerSubpage = paths[paths.indexOf('locker') + 1] || '';
    return { lockerSubpage };
}
export const EscrowInfo = ({ className }) => {
    const location = useLocation();
    const { lockerSubpage } = getParams(location.pathname);
    const { governor, path } = useGovernor();
    const { data: locker } = useLocker();
    const { data: govToken } = useToken(locker?.account.tokenMint);
    const [govTokenBalance] = useUserATAs(govToken);
    const { data: escrow, isLoading, govTokensLocked } = useUserEscrow();
    const { sdkMut } = useSDK();
    const lockModalVariant = lockerSubpage === "lock" || lockerSubpage === "extend"
        ? lockerSubpage
        : null;
    const showModal = !!lockModalVariant;
    return (React.createElement(Card, { className: className, title: "Voting Wallet" },
        React.createElement(LockEscrowModal, { variant: lockModalVariant, escrowW: escrow ? escrow.escrowW : null, isOpen: showModal, onDismiss: () => navigate(`/tribeca/gov/${governor.toString()}/locker`) }),
        React.createElement(CardItem, { label: `${govToken?.symbol ?? "Token"} Balance` },
            React.createElement("div", { className: "flex items-center gap-2.5 h-7" },
                govTokenBalance ? (React.createElement(TokenAmountDisplay, { amount: govTokenBalance.balance, showSymbol: false })) : (React.createElement("div", { className: "h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" })),
                React.createElement(TokenIcon, { size: 18, token: govToken }))),
        React.createElement(CardItem, { label: `Your ${govToken?.symbol ?? "Token"} Locked` },
            React.createElement("div", { className: "flex items-center gap-2.5 h-7" },
                govTokensLocked ? (React.createElement(TokenAmountDisplay, { amount: govTokensLocked, showSymbol: false })) : (React.createElement(ContentLoader, { className: "h-4 w-12" })),
                React.createElement(TokenIcon, { size: 18, token: govToken }))),
        React.createElement("div", { className: "px-7 py-4 flex gap-4" }, !escrow && isLoading ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]" }),
            React.createElement("div", { className: "w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]" }))) : !sdkMut ? (React.createElement("div", { className: "w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]" })) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: escrow ? "w-1/2" : "w-full" },
                React.createElement(Link, { to: `/tribeca${path}/locker/lock`, className: "flex-grow" },
                    React.createElement(Button, { className: "w-full hover:dark:text-primary hover:dark:border-primary", type: "button", size: "md", variant: "outline" }, "Lock"))),
            escrow && (React.createElement("div", { className: "w-1/2" },
                React.createElement(Link, { to: `/tribeca${path}/locker/extend`, className: "flex-grow" },
                    React.createElement(Button, { className: "w-full hover:dark:text-primary hover:dark:border-primary", type: "button", size: "md", variant: "outline" }, "Extend")))))))));
};
