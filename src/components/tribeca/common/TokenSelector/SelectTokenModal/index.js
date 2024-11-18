import { useUserATAs } from "@rockooor/sail";
import { RAW_SOL_MINT } from "@saberhq/token-utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useSDK } from "../../../../../contexts/sdk";
import { LoadingSpinner } from "../../LoadingSpinner";
import { Modal } from "../../Modal";
import { TokenIcon } from "../../TokenIcon";
import { ReactComponent as SolanaLogo } from "./solana.svg";
import { ReactComponent as Solscan } from "./solscan.svg";
import { ReactComponent as SolscanGray } from "./solscan-gray.svg";
export const SelectTokenModal = ({ onSelect, tokens, ...modalProps }) => {
    const wallet = useAnchorWallet();
    const { nativeBalance } = useSDK();
    const balances = useUserATAs(...tokens);
    return (React.createElement(Modal, { ...modalProps, className: "p-0" },
        React.createElement("div", { className: "grid gap-3 py-3" },
            React.createElement("div", { className: "h-6 flex items-center justify-center" },
                React.createElement(SolanaLogo, null)),
            React.createElement("div", { className: "mt-10 px-7" },
                React.createElement("h2", { className: "font-bold text-xl" }, "Select a token")),
            React.createElement("div", null, tokens.map((token) => {
                const userBalance = balances.find((b) => b?.balance?.token?.equals(token));
                const balance = token.mintAccount.equals(RAW_SOL_MINT)
                    ? nativeBalance
                    : userBalance?.balance;
                return (
                // TODO: make this accessible
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                React.createElement("div", { role: "button", tabIndex: 0, key: token.address, className: "cursor-pointer hover:bg-gray-100 h-16 flex items-center px-7", onClick: () => {
                        onSelect(token);
                    } },
                    React.createElement("div", { className: "flex items-center h-full w-full justify-between border-b" },
                        React.createElement("div", { className: "flex gap-3 items-center w-full h-full" },
                            React.createElement(TokenIcon, { size: 20, token: token }),
                            React.createElement("div", { className: "flex flex-col flex-shrink-[1]" },
                                React.createElement("span", { className: "text-sm font-medium" }, token.name),
                                wallet && (React.createElement("span", { className: "text-xs text-secondary" }, userBalance === undefined ? (React.createElement(LoadingSpinner, null)) : (balance?.formatUnits() ?? `0 ${token.symbol}`))))),
                        React.createElement("a", { className: "group", href: `https://solscan.io/address/${token.address}`, target: "_blank", onClick: (e) => {
                                e.stopPropagation();
                            }, rel: "noreferrer" },
                            React.createElement(Solscan, { className: "hidden group-hover:block" }),
                            React.createElement(SolscanGray, { className: "group-hover:hidden" })))));
            })))));
};
