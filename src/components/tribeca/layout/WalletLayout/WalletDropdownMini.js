import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { startCase } from "lodash-es";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import React from "react";
import { useEnvironment } from "../../../../utils/tribeca/useEnvironment";
import { shortenAddress } from "../../../../utils/tribeca/utils";
import { Drop } from "../../common/Drop";
import { WalletButton } from "../GovernorLayout/Header/WalletButton";
import { AccountPopover } from "../MainLayout/Header/WalletDropdown/AccountPopover";
export const WalletDropdownMini = () => {
    const { network } = useEnvironment();
    const wallet = useAnchorWallet();
    const { wallet: solanaWallet } = useWallet();
    const [targetRef, setTargetRef] = useState(null);
    const [showAccountPopover, setShowAccountPopover] = useState(false);
    return (React.createElement(React.Fragment, null, wallet ? (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "px-5 py-3 w-full flex items-center justify-between border rounded hover:bg-gray-50", ref: setTargetRef, onClick: () => {
                setShowAccountPopover((p) => !p);
            } },
            React.createElement("div", { className: "text-left grid gap-0.5 text-sm" },
                React.createElement("span", { className: "font-semibold" }, shortenAddress(wallet.publicKey.toString())),
                React.createElement("span", { className: "text-secondary" }, startCase(network))),
            React.createElement("div", null, solanaWallet && (React.createElement(React.Fragment, null, typeof solanaWallet.adapter.icon === "string" && (React.createElement("img", { className: "h-4 w-4", src: solanaWallet.adapter.icon, alt: `Icon for wallet ${solanaWallet.adapter.name}` })))))),
        React.createElement(Drop, { onDismiss: () => setShowAccountPopover(false), target: targetRef, show: showAccountPopover, placement: isMobile ? "top" : "top-start" },
            React.createElement(AccountPopover, { close: () => setShowAccountPopover(false) })))) : (React.createElement(WalletButton, null))));
};
