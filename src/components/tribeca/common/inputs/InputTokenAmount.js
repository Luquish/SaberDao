import { TokenAmount } from "@saberhq/token-utils";
import React from "react";
import { TokenAmountDisplay } from "../TokenAmountDisplay";
import { TokenSelector } from "../TokenSelector";
import { InputDecimal } from "./InputDecimal";
/**
 * Selects a token and its amount
 * @param param0
 * @returns
 */
export const InputTokenAmount = ({ label, tokens, onTokenSelect, token, inputValue, inputOnChange, inputDisabled = false, currentAmount, className, isLoading, }) => {
    return (React.createElement("div", { className: `flex flex-col gap-2 ${className}` },
        React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", { className: "text-sm font-medium" }, label),
            token && (React.createElement("div", null, currentAmount ? (React.createElement(Balance, null,
                React.createElement("span", null,
                    currentAmount.label ?? "Balance",
                    ":"),
                currentAmount.amount ? (React.createElement(Accent, { onClick: currentAmount.allowSelect
                        ? () => {
                            inputOnChange?.(currentAmount.amount?.toExact() ?? "0");
                        }
                        : undefined },
                    React.createElement(TokenAmountDisplay, { amount: currentAmount.amount ?? new TokenAmount(token, 0), exact: true }))) : (React.createElement(NoAmount, null, "--")))) : (React.createElement("div", null))))),
        React.createElement("div", { className: "flex gap-4" },
            React.createElement(TokenSelector, { className: "bg-white border dark:(bg-warmGray-800 border-warmGray-600) rounded w-[200px]", tokens: tokens, isLoading: isLoading, token: token, onSelect: onTokenSelect }),
            React.createElement(InputDecimal, { className: "flex-grow text-right w-1/2 bg-transparent dark:bg-warmGray-800 border-none", placeholder: "0.00", disabled: inputDisabled, value: inputValue, onChange: inputOnChange }))));
};
function NoAmount({ children }) {
    return React.createElement("span", { className: "ml-2 text-gray-800" }, children);
}
function Accent({ children, onClick }) {
    return (React.createElement("span", { className: `ml-2 text-primary ${onClick ? 'cursor-pointer hover:underline' : ''}`, onClick: onClick }, children));
}
function Balance({ children }) {
    return (React.createElement("div", { className: "flex items-center font-normal text-[13px] text-default" }, children));
}
