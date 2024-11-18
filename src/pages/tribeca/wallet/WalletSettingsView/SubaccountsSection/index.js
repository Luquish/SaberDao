import { findOwnerInvokerAddress, findWalletDerivedAddress, } from "@gokiprotocol/client";
import { useQuery } from "@tanstack/react-query";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { AddressLink } from "../../../../common/AddressLink";
export const SubaccountsSection = () => {
    const { key } = useSmartWallet();
    const { data: subaccounts } = useQuery({
        queryKey: ["smartWalletSubaccounts", key.toString()],
        queryFn: async () => {
            const ownerInvokers = await Promise.all(Array(3)
                .fill(null)
                .map(async (_, i) => {
                const [address] = await findOwnerInvokerAddress(key, i);
                return {
                    index: i,
                    address,
                };
            }));
            const derived = await Promise.all(Array(3)
                .fill(null)
                .map(async (_, i) => {
                const [address] = await findWalletDerivedAddress(key, i);
                return {
                    index: i,
                    address,
                };
            }));
            return { ownerInvokers, derived };
        },
    });
    return (React.createElement("div", null,
        React.createElement("h2", { tw: "text-xl font-medium mb-1" }, "Subaccounts"),
        React.createElement("div", { tw: "text-sm" }, subaccounts?.ownerInvokers.map(({ index, address }) => {
            return (React.createElement("div", { key: `owner_invoker_${index}`, tw: "h-11 flex items-center justify-between border-b px-2" },
                React.createElement("div", null,
                    React.createElement("code", null,
                        "owner_invoker/",
                        index)),
                React.createElement(AddressLink, { address: address, showCopy: true })));
        })),
        React.createElement("div", { tw: "text-sm" }, subaccounts?.derived.map(({ index, address }) => {
            return (React.createElement("div", { key: `derived_${index}`, tw: "h-11 flex items-center justify-between border-b px-2" },
                React.createElement("div", null,
                    React.createElement("code", null,
                        "derived/",
                        index)),
                React.createElement(AddressLink, { address: address, showCopy: true })));
        }))));
};
