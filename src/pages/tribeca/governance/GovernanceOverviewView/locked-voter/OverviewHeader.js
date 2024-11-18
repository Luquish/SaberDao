import { useTokenAmount, useTokenMint } from "@rockooor/sail";
import { mapN } from "@saberhq/solana-contrib";
import { TokenAmount } from "@saberhq/token-utils";
import React from 'react';
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useVotersList } from "../../voters/AllVotersView/useVotersList";
export const OverviewHeader = () => {
    const { govToken, veToken, lockedSupply } = useGovernor();
    const { data: votersList } = useVotersList();
    const { data: govTokenData } = useTokenMint(govToken?.mintAccount);
    const totalSupplyFmt = mapN((govTokenData, govToken) => new TokenAmount(govToken, govTokenData.account.supply).format({
        numberFormatOptions: {
            maximumFractionDigits: 0,
        },
    }), govTokenData, govToken);
    const lockedSupplyFmt = lockedSupply
        ? lockedSupply.format({
            numberFormatOptions: {
                maximumFractionDigits: 0,
            },
        })
        : lockedSupply;
    const totalVeTokens = useTokenAmount(veToken, votersList?.totalVotes ?? "0");
    return (React.createElement("div", { className: "flex flex-wrap gap-2.5" },
        React.createElement("div", { className: "flex-grow basis-full md:basis-auto bg-coolGray-800 p-5 rounded" },
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("div", { className: "h-7 flex items-center" }, lockedSupplyFmt ? (React.createElement("span", { className: "text-white text-xl font-semibold" }, lockedSupplyFmt)) : (React.createElement("div", { className: "flex animate-pulse bg-gray h-4 w-12 rounded" }))),
                React.createElement("span", { className: "text-xs font-semibold text-coolGray-300 tracking-tighter" },
                    govToken?.symbol,
                    " Locked"))),
        React.createElement("div", { className: "flex-grow md:(basis-[200px] flex-grow-0) bg-coolGray-800 p-5 rounded" },
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("div", { className: "h-7 flex items-center" }, totalVeTokens ? (React.createElement("span", { className: "text-white text-xl font-semibold" }, totalVeTokens.asNumber.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                }))) : (React.createElement("div", { className: "flex animate-pulse bg-gray h-4 w-12 rounded" }))),
                React.createElement("span", { className: "text-xs font-semibold text-coolGray-300 tracking-tighter" },
                    "Total Supply of ",
                    veToken?.symbol))),
        React.createElement("div", { className: "flex-grow md:(basis-[200px] flex-grow-0) bg-coolGray-800 p-5 rounded" },
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("div", { className: "h-7 flex items-center" }, totalSupplyFmt ? (React.createElement("span", { className: "text-white text-xl font-semibold" }, totalSupplyFmt)) : (React.createElement("div", { className: "flex animate-pulse bg-gray h-4 w-12 rounded" }))),
                React.createElement("span", { className: "text-xs font-semibold text-coolGray-300 tracking-tighter" },
                    "Total Supply of ",
                    govToken?.symbol)))));
};
