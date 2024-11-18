import { DEFAULT_NETWORK_CONFIG_MAP } from "@saberhq/solana-contrib";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import copyToClipboard from "copy-to-clipboard";
import React from "react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { notify } from "@/utils/tribeca/notifications";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { Button } from "../../../../common/Button";
import { Profile } from "../../../../common/governance/Profile";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";
export const AccountPopover = ({ close }) => {
    const { network } = useEnvironment();
    const { publicKey } = useWallet();
    if (!publicKey) {
        return null;
    }
    return (React.createElement("div", { className: "w-screen max-w-[378px]" },
        React.createElement("div", { className: "w-11/12 md:w-full bg-white rounded-lg border dark:(bg-warmGray-850 border-warmGray-800)" },
            React.createElement("div", { className: "flex items-center justify-between p-7 border-b dark:border-warmGray-800" },
                React.createElement("div", { className: "grid gap-2 text-base" },
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement(Profile, { address: publicKey })),
                    React.createElement("span", { className: "text-secondary" }, DEFAULT_NETWORK_CONFIG_MAP[network].name)),
                React.createElement("div", { className: "flex gap-3" },
                    React.createElement(MouseoverTooltip, { text: "Copy Address" },
                        React.createElement(Button, { variant: "muted", icon: true, onClick: () => {
                                copyToClipboard(publicKey.toString());
                                close?.();
                                notify({ message: "Address copied to clipboard." });
                            } },
                            React.createElement(FaCopy, null))),
                    React.createElement(MouseoverTooltip, { text: "View on Explorer" },
                        React.createElement("a", { href: `https://explorer.solana.com/address/${publicKey.toString()}`, target: "_blank", rel: "noopener noreferrer" },
                            React.createElement(Button, { variant: "muted", icon: true },
                                React.createElement(FaExternalLinkAlt, null)))))),
            React.createElement(WalletDisconnectButton, null))));
};
