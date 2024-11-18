import copy from "copy-to-clipboard";
import React from "react";
import { notify } from "../../../utils/tribeca/notifications";
import { displayAddress } from "../../../utils/tribeca/programs";
import { useEnvironment } from "../../../utils/tribeca/useEnvironment";
import { shortenAddress } from "../../../utils/tribeca/utils";
export const AddressLink = ({ address, className, shorten = true, showCopy = false, showRaw = true, prefixLinkUrlWithAnchor = false, children, }) => {
    const { network } = useEnvironment();
    const urlPrefix = prefixLinkUrlWithAnchor
        ? "https://anchor.so"
        : "https://explorer.solana.com";
    return (React.createElement("div", { className: "inline-flex items-center" },
        React.createElement("a", { className: "text-gray-800 dark:text-warmGray-200 hover:text-primary", href: `${urlPrefix}/address/${address.toString()}?cluster=${network?.toString() ?? ""}`, target: "_blank", rel: "noopener noreferrer" }, children ??
            (showRaw
                ? shorten
                    ? shortenAddress(address.toString())
                    : address.toString()
                : displayAddress(address.toString(), shorten))),
        showCopy && (React.createElement("div", { className: "ml-1 cursor-pointer text-gray-800 dark:text-warmGray-200 hover:text-primary", onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                copy(address.toString());
                notify({ message: "Copied address to clipboard." });
            } }))));
};
