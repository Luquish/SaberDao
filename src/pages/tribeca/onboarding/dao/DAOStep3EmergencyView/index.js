import { useSail } from "@rockooor/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useLocation } from "@reach/router";
import { navigate } from "@reach/router";
import invariant from "tiny-invariant";
import React from "react";
import { useSDK } from "../../../../../contexts/sdk";
import { useSmartWalletAddress } from "../../../../../hooks/tribeca/useSmartWalletAddress";
import { useWrapTx } from "../../../../../hooks/tribeca/useWrapTx";
import { handleException } from "../../../../../utils/tribeca/error";
import { notify } from "../../../../../utils/tribeca/notifications";
import { AsyncButton } from "../../../../../components/tribeca/common/AsyncButton";
import { Button } from "../../../../../components/tribeca/common/Button";
import { InputText } from "../../../../../components/tribeca/common/inputs/InputText";
// Función auxiliar para obtener parámetros de la URL
function getParams(pathname) {
    const paths = pathname.split('/');
    const executive = paths[paths.indexOf('dao') + 1] || '';
    return { executive };
}
export const DAOStep3EmergencyView = () => {
    const location = useLocation();
    const { executive } = getParams(location.pathname);
    const [baseKP, setBaseKP] = useState(Keypair.generate());
    const { data: smartWalletKey } = useSmartWalletAddress(baseKP.publicKey);
    const { sdkMut } = useSDK();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    return (React.createElement("div", { className: "grid gap-12 w-full max-w-sm mx-auto" },
        React.createElement("div", null,
            React.createElement("div", { className: "mb-8" },
                React.createElement("h1", { className: "font-bold text-2xl mb-4 dark:text-gray-50" }, "Create the Emergency Multisig")),
            React.createElement("div", { className: "flex flex-col items-center gap-16" },
                React.createElement("div", { className: "prose prose-sm dark:prose-light" },
                    React.createElement("p", null, "The Emergency Multisig is intended to be used for occasions where trusted parties determine one should bypass governance."),
                    React.createElement("p", null, "For now, we'll add your wallet to the Emergency Multisig. You will want to add other members, e.g. other protocols or developers in the space that are well known and trusted, in the future.")),
                React.createElement("div", { className: "flex flex-col w-full" },
                    React.createElement("span", { className: "text-xs mb-1.5" }, "Emergency Multisig Address"),
                    React.createElement("div", { className: "flex gap-2 w-full" },
                        React.createElement(InputText, { className: "h-10 flex-grow", disabled: true, value: smartWalletKey?.toString() }),
                        React.createElement(Button, { className: "flex items-center gap-2 h-10", onClick: () => {
                                setBaseKP(Keypair.generate());
                            } },
                            React.createElement("span", null, "Reroll"),
                            React.createElement(FaDice, null)))),
                React.createElement("div", null,
                    React.createElement(AsyncButton, { size: "md", variant: "primary", disabled: !executive, onClick: async () => {
                            invariant(executive, "executive");
                            try {
                                invariant(sdkMut, "sdk");
                                const { tx, smartWalletWrapper } = await sdkMut.newSmartWallet({
                                    owners: [sdkMut.provider.wallet.publicKey],
                                    threshold: new BN(1),
                                    // default to 11 max owners
                                    // if people complain about cost, we can reduce this
                                    numOwners: 11,
                                    base: baseKP,
                                });
                                notify({
                                    message: "Creating the Emergency Multisig",
                                    description: "Please sign the transaction in your wallet to continue.",
                                });
                                const { pending, success } = await handleTX(await wrapTx(tx), "Create Emergency Multisig");
                                if (!success || !pending) {
                                    return;
                                }
                                await pending.wait({ commitment: "confirmed" });
                                notify({
                                    message: `Wallet created successfully`,
                                    description: smartWalletWrapper.key.toString(),
                                });
                                void navigate(`/tribeca/onboarding/dao/create-dao?executive=${executive.toString()}&emergency=${smartWalletWrapper.key.toString()}`);
                            }
                            catch (e) {
                                handleException(e, {
                                    source: "create-multisig",
                                });
                            }
                        } }, "Create Emergency Multisig"))))));
};
export default DAOStep3EmergencyView;
