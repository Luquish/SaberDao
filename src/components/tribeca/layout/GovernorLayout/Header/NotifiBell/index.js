import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import React, { useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Drop } from "../../../../common/Drop";
import { SubscriptionPopoverContainer } from "./SubscriptionPopoverContainer";
const isMessageSignerWalletAdapter = (instance) => {
    if (typeof instance === "object" &&
        instance !== null &&
        "signMessage" in instance) {
        const { signMessage } = instance;
        return typeof signMessage === "function";
    }
    return false;
};
export const NotifiBell = ({ className }) => {
    const [targetRef, setTargetRef] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const { daoName, governor } = useGovernor();
    const wallet = useAnchorWallet();
    const { wallet: solanaWallet } = useWallet();
    const walletPublicKey = useMemo(() => {
        if (wallet) {
            return wallet.publicKey.toBase58();
        }
        return null;
    }, [wallet]);
    const messageSigner = useMemo(() => {
        if (solanaWallet) {
            const wrapped = solanaWallet.adapter;
            if (wrapped) {
                const underlying = wrapped;
                if (isMessageSignerWalletAdapter(underlying)) {
                    return underlying;
                }
            }
        }
        return null;
    }, [solanaWallet]);
    const title = useMemo(() => {
        if (!daoName || !governor) {
            return "Loading";
        }
        else if (!walletPublicKey) {
            return "Please connect your wallet";
        }
        else if (!messageSigner) {
            return "Unsupported wallet";
        }
        else {
            return "Manage Notifications";
        }
    }, [daoName, governor, walletPublicKey, messageSigner]);
    const isEnabled = daoName && governor;
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "relative z-20 md:z-auto", disabled: !isEnabled, title: title, onClick: () => {
                setShowNotifications((show) => !show);
            }, ref: setTargetRef },
            React.createElement(FaBell, null)),
        React.createElement(Drop, { onDismiss: () => setShowNotifications(false), target: targetRef, show: showNotifications, placement: "bottom-end" }, isEnabled ? (React.createElement(SubscriptionPopoverContainer, { daoName: daoName, governor: governor.toString(), walletPublicKey: walletPublicKey, signer: messageSigner })) : null)));
};
