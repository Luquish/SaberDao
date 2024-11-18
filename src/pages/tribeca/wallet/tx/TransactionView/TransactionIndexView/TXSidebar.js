import copyToClipboard from "copy-to-clipboard";
import { startCase } from "lodash-es";
import { FaCheckCircle, FaLink, FaQuestionCircle } from "react-icons/fa";
import { useSmartWallet } from "@/hooks/useSmartWallet";
import { notify } from "@/utils/notifications";
import { NamedAddressLink } from "../../../../../common/account/NamedAddressLink";
import { AddressLink } from "../../../../../common/AddressLink";
import { useTransaction } from "../context";
export const TXSidebar = () => {
    const { smartWalletData } = useSmartWallet();
    const { tx, id, executedAt, eta, state } = useTransaction();
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { tw: "text-xs border-b pb-2" },
            React.createElement("div", { tw: "flex" },
                React.createElement("span", { tw: "font-semibold text-secondary w-[90px]" }, id),
                React.createElement("div", { tw: "text-secondary" },
                    React.createElement(FaLink, { onClick: () => {
                            copyToClipboard(window.location.href);
                            notify({
                                message: "Transaction link copied to clipboard.",
                                description: "Paste it wherever you like.",
                            });
                        } })))),
        React.createElement("div", { tw: "text-xs mt-4" },
            React.createElement("div", { tw: "flex mb-4" },
                React.createElement("span", { tw: "text-secondary w-[90px]" }, "Key"),
                React.createElement("span", null,
                    React.createElement(AddressLink, { address: tx.publicKey, showCopy: true }))),
            React.createElement("div", { tw: "flex mb-4" },
                React.createElement("span", { tw: "text-secondary w-[90px]" }, "State"),
                React.createElement("span", null, startCase(state))),
            React.createElement("div", { tw: "flex mb-4" },
                React.createElement("span", { tw: "text-secondary w-[90px]" }, "ETA"),
                React.createElement("span", null, eta?.toLocaleString(undefined, {
                    timeZoneName: "short",
                }) ?? "--")),
            React.createElement("div", { tw: "flex mb-4" },
                React.createElement("span", { tw: "text-secondary w-[90px]" }, "Signers"),
                React.createElement("div", { tw: "grid gap-1" }, tx.account.signers.map((signer, i) => {
                    const currSigner = smartWalletData?.account?.owners?.[i];
                    if (currSigner) {
                        return (React.createElement("div", { tw: "flex items-center gap-2", key: i },
                            React.createElement(NamedAddressLink, { address: currSigner }),
                            signer ? (React.createElement(FaCheckCircle, { tw: "text-primary" })) : (React.createElement(FaQuestionCircle, { tw: "text-gray-500" }))));
                    }
                }))),
            React.createElement("div", { tw: "flex mb-4" },
                React.createElement("span", { tw: "text-secondary w-[90px]" }, "Proposer"),
                React.createElement("span", null,
                    React.createElement(NamedAddressLink, { address: tx.account.proposer, showCopy: true }))),
            React.createElement("div", { tw: "flex mb-4" },
                React.createElement("span", { tw: "text-secondary w-[90px] flex-shrink-0" }, "Executed At"),
                React.createElement("span", { tw: "flex-shrink" }, executedAt?.toLocaleString(undefined, {
                    timeZoneName: "short",
                }) ?? "--")),
            executedAt && (React.createElement("div", { tw: "flex mb-4" },
                React.createElement("span", { tw: "text-secondary w-[90px]" }, "Executor"),
                React.createElement("span", null,
                    React.createElement(NamedAddressLink, { address: tx.account.executor, showCopy: true })))))));
};
