import { AddressWithContext } from "@/common/program/AddressWithContext";
import { Box } from "./Box";
export const IXAccounts = ({ accounts }) => {
    return (React.createElement(Box, { title: `Accounts (${accounts.length})`, tw: "p-0" },
        React.createElement("div", { tw: "overflow-x-auto whitespace-nowrap" }, accounts.map((account, i) => {
            return (React.createElement("div", { key: `account_${i}`, tw: "px-6 py-2 flex items-center gap-4 justify-between border-t border-t-gray-150 dark:border-t-warmGray-600" },
                React.createElement("div", { tw: "flex items-center gap-4" },
                    React.createElement("span", { tw: "text-gray-500 font-semibold" }, account.name ?? `Account #${i}`),
                    React.createElement("div", { tw: "flex items-center gap-2" },
                        account.isWritable && (React.createElement("div", { tw: "border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2" },
                            React.createElement("div", { tw: "h-2 w-2 bg-primary rounded-full" }),
                            React.createElement("span", null, "writable"))),
                        account.isSigner && (React.createElement("div", { tw: "border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2" },
                            React.createElement("div", { tw: "h-2 w-2 bg-accent rounded-full" }),
                            React.createElement("span", null, "signer"))))),
                React.createElement("div", { tw: "text-gray-800 font-medium flex-shrink-0" },
                    React.createElement(AddressWithContext, { pubkey: account.pubkey, prefixLinkUrlWithAnchor: true }))));
        }))));
};
