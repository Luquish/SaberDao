import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { TokenIcon } from "../TokenIcon";
import { SelectTokenModal } from "./SelectTokenModal";
export const TokenSelector = ({ className, tokens, token, onSelect, isLoading, }) => {
    const [showSelector, setShowSelector] = useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(AssetSelectButton, { className: "h-full", noAsset: !token, disabled: !onSelect, onClick: () => setShowSelector(!showSelector) },
            token ? (React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement(TokenIcon, { size: 32, token: token }),
                React.createElement("div", null,
                    React.createElement("div", { className: "font-medium" }, token.name),
                    React.createElement("div", { className: "leading-none text-secondary" }, token.symbol)))) : isLoading ? (React.createElement("div", null,
                React.createElement(LoadingSpinner, null))) : (React.createElement("div", null, "Select a token")),
            onSelect && (React.createElement("div", { className: "text-base flex items-center ml-6" },
                React.createElement(FiChevronDown, null)))),
        !isLoading && onSelect && (React.createElement(SelectTokenModal, { tokens: tokens, isOpen: showSelector, onDismiss: () => {
                setShowSelector(false);
            }, onSelect: (token) => {
                onSelect?.(token);
                setShowSelector(false);
            } }))));
};
function getAssetSelectButtonClasses({ disabled, noAsset, className = "", }) {
    return `
    relative text-left flex flex-none items-center justify-between
    appearance-none text-base
    whitespace-nowrap py-2 px-4 rounded
    ${disabled ? "cursor-default" : "cursor-pointer hover:bg-gray-100 active:bg-gray-200"}
    ${!disabled && noAsset ? "hover:bg-gray-100 active:bg-gray-200" : ""}
    ${className}
  `.trim();
}
function AssetSelectButton({ children, noAsset, disabled, className, ...props }) {
    return (React.createElement("button", { className: getAssetSelectButtonClasses({ disabled, noAsset, className }), disabled: disabled, ...props }, children));
}
