import { useSail } from "@rockooor/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { useSDK } from "../../../../../contexts/sdk";
import { useOwnerInvokerAddress, useSmartWalletAddress, } from "../../../../../hooks/useSmartWalletAddress";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { handleException } from "../../../../../utils/error";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";
export const DAOStep2ExecutiveView = () => {
    const [baseKP, setBaseKP] = useState(Keypair.generate());
    const { data: smartWalletKey } = useSmartWalletAddress(baseKP.publicKey);
    const { data: ownerInvokerKey } = useOwnerInvokerAddress(smartWalletKey);
    const { sdkMut } = useSDK();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const navigate = useNavigate();
    return (React.createElement("div", { tw: "grid gap-12 w-full max-w-sm mx-auto" },
        React.createElement("div", null,
            React.createElement("div", { tw: "mb-8" },
                React.createElement("h1", { tw: "font-bold text-2xl mb-4 dark:text-gray-50" }, "Create the Executive Council")),
            React.createElement("div", { tw: "flex flex-col items-center gap-16" },
                React.createElement("div", { tw: "prose prose-sm dark:prose-light" },
                    React.createElement("p", null, "The Executive Council is a Smart Wallet which allows trusted individuals to carry out the execution of governance proposals."),
                    React.createElement("p", null, "The DAO will be configured to allow any member of the Smart Wallet to execute a transaction once it has been queued by Tribeca."),
                    React.createElement("p", null, "This protects your DAO from frontrunning, sandwich attacks, MEV exploits, and other common attacks resulting from arbitrary parties being able to execute a proposal.")),
                React.createElement("div", { tw: "flex flex-col w-full gap-4" },
                    React.createElement("div", { tw: "flex flex-col w-full" },
                        React.createElement("span", { tw: "text-xs mb-1.5" }, "Executive Council Key"),
                        React.createElement("div", { tw: "flex gap-2 w-full" },
                            React.createElement(InputText, { tw: "h-10 flex-grow", disabled: true, value: ownerInvokerKey?.toString() }),
                            React.createElement(Button, { tw: "flex items-center gap-2 h-10", onClick: () => {
                                    setBaseKP(Keypair.generate());
                                } },
                                React.createElement("span", null, "Reroll"),
                                React.createElement(FaDice, null)))),
                    React.createElement("div", { tw: "flex flex-col w-full" },
                        React.createElement("span", { tw: "text-xs mb-1.5" }, "Smart Wallet"),
                        React.createElement("div", { tw: "flex gap-2 w-full" },
                            React.createElement(InputText, { tw: "h-10 flex-grow", disabled: true, value: smartWalletKey?.toString() })))),
                React.createElement("div", null,
                    React.createElement(AsyncButton, { size: "md", variant: "primary", disabled: !ownerInvokerKey, onClick: async () => {
                            try {
                                invariant(sdkMut && ownerInvokerKey, "sdk");
                                const { tx, smartWalletWrapper } = await sdkMut.newSmartWallet({
                                    owners: [sdkMut.provider.wallet.publicKey],
                                    threshold: new BN(1),
                                    // default to 11 max owners
                                    // if people complain about cost, we can reduce this
                                    numOwners: 11,
                                    base: baseKP,
                                });
                                const subaccountTX = await sdkMut.createSubaccountInfo({
                                    smartWallet: smartWalletWrapper.key,
                                    index: 0,
                                    type: "ownerInvoker",
                                });
                                notify({
                                    message: "Creating the Executive Council",
                                    description: "Please sign the transaction in your wallet to continue.",
                                });
                                const { pending, success } = await handleTX(await wrapTx(tx.combine(subaccountTX)), "Create Executive Council");
                                if (!success || !pending) {
                                    return;
                                }
                                await pending.wait({ commitment: "confirmed" });
                                notify({
                                    message: `Executive Council created successfully`,
                                    description: `Invoker: ${ownerInvokerKey.toString()}`,
                                });
                                navigate(`/onboarding/dao/create-emergency?executive=${ownerInvokerKey.toString()}`);
                            }
                            catch (e) {
                                handleException(e, {
                                    source: "create-ec",
                                });
                            }
                        } }, "Create Executive Council"))))));
};
export default DAOStep2ExecutiveView;
