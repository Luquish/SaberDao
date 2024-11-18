import { useSail } from "@rockooor/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import React, { useState } from "react";
import { FaDice } from "react-icons/fa";
import { navigate } from "@reach/router";
import { Link } from "gatsby";
import invariant from "tiny-invariant";
import { useSDK } from "../../../../contexts/sdk";
import { useSmartWalletAddress } from "../../../../hooks/tribeca/useSmartWalletAddress";
import { useWrapTx } from "../../../../hooks/tribeca/useWrapTx";
import { handleException } from "../../../../utils/tribeca/error";
import { notify } from "../../../../utils/tribeca/notifications";
import { AsyncButton } from "../../../../components/tribeca/common/AsyncButton";
import { Button } from "../../../../components/tribeca/common/Button";
export const WalletCreateSimpleView = () => {
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { sdkMut } = useSDK();
    const [baseKP, setBaseKP] = useState(Keypair.generate());
    const walletKey = useSmartWalletAddress(baseKP.publicKey);
    return (React.createElement("div", { className: "grid gap-12 w-full max-w-sm mx-auto" },
        React.createElement("div", null,
            React.createElement("div", { className: "mb-8" },
                React.createElement("h1", { className: "font-bold text-3xl mb-4" }, "Let's create a wallet"),
                React.createElement("h2", { className: "text-secondary font-medium text-sm" }, "Goki Smart Wallet is a secure multisig wallet for managing funds and admin privileges.")),
            React.createElement("div", { className: "flex flex-col gap-16" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "font-medium mb-2" }, "Your Wallet Address"),
                    React.createElement("div", { className: "flex items-center justify-between gap-4" },
                        React.createElement("span", { className: "text-sm font-medium break-words" }, walletKey.data ? walletKey.data.toString() : "--"),
                        React.createElement(Button, { className: "flex items-center gap-2", onClick: () => {
                                setBaseKP(Keypair.generate());
                            } },
                            React.createElement("span", null, "Reroll"),
                            React.createElement(FaDice, null)))),
                React.createElement("div", { className: "mx-auto flex flex-col items-center gap-6" },
                    React.createElement(AsyncButton, { type: "submit", className: "w-[200px]", variant: "primary", size: "md", onClick: async () => {
                            try {
                                invariant(sdkMut, "sdk");
                                const { tx, smartWalletWrapper } = await sdkMut.newSmartWallet({
                                    owners: [sdkMut.provider.wallet.publicKey],
                                    threshold: new BN(1),
                                    numOwners: 11,
                                    base: baseKP,
                                });
                                notify({
                                    message: "Creating your Goki Smart Wallet",
                                    description: "Please sign the transaction in your wallet to continue.",
                                });
                                const { pending, success } = await handleTX(await wrapTx(tx), "Create Multisig");
                                if (!success || !pending) {
                                    return;
                                }
                                await pending.wait({ commitment: "confirmed" });
                                notify({
                                    message: `Wallet created successfully`,
                                    description: smartWalletWrapper.key.toString(),
                                });
                                navigate(`/wallets/${smartWalletWrapper.key.toString()}`);
                            }
                            catch (e) {
                                handleException(e, {
                                    source: "create-multisig",
                                });
                            }
                        } }, "Create Wallet"),
                    React.createElement("span", { className: "text-sm" },
                        "Already have a wallet?",
                        " ",
                        React.createElement(Link, { to: "/user", className: "text-primary hover:text-primary-300 transition-colors" }, "Select your wallet")))))));
};
export default WalletCreateSimpleView;
