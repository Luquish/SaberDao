import { shortenAddress } from "@cardinal/namespaces";
import { useSail } from "@rockooor/sail";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import React from "react";
import { useCardinalDisplayName } from "../../../../../hooks/tribeca/cardinal/useAddressName";
import { ContentLoader } from "../../../common/ContentLoader";
import { Drop } from "../../../common/Drop";
import { AccountPopover } from "../../MainLayout/Header/WalletDropdown/AccountPopover";
import { WalletButton } from "./WalletButton";
export const WalletDropdown = ({ className }) => {
    const wallet = useAnchorWallet();
    const { name, reverseEntryKey } = useCardinalDisplayName(wallet?.publicKey);
    const { wallet: solanaWallet } = useWallet();
    const [targetRef, setTargetRef] = useState(null);
    const [showAccountPopover, setShowAccountPopover] = useState(false);
    const { refetch } = useSail();
    useEffect(() => {
        if (reverseEntryKey) {
            void refetch(reverseEntryKey);
        }
        // handle is desired to be in here to enforce refresh of the name when modal closes
    }, [refetch, reverseEntryKey]);
    return (React.createElement(React.Fragment, null, wallet ? (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "px-3 py-1 flex items-center gap-2 justify-between rounded border dark:(text-white border-none bg-warmGray-800 hover:bg-coolGray-800) z-20 md:z-auto", ref: setTargetRef, onClick: () => {
                setShowAccountPopover((p) => !p);
            } },
            React.createElement("div", null, solanaWallet && (React.createElement(React.Fragment, null, typeof solanaWallet.adapter.icon === "string" && (React.createElement("img", { className: "h-4 w-4", src: solanaWallet.adapter.icon, alt: `Icon for wallet ${solanaWallet.adapter.name}` }))))),
            React.createElement("span", { className: "text-sm font-semibold" }, name === undefined || !wallet ? (React.createElement(ContentLoader, null)) : name === null ? (shortenAddress(wallet.publicKey.toString())) : (name))),
        React.createElement(Drop, { onDismiss: () => setShowAccountPopover(false), target: targetRef, show: showAccountPopover, placement: "bottom-end" },
            React.createElement(AccountPopover, { close: () => setShowAccountPopover(false) })))) : (React.createElement(WalletButton, null))));
};
