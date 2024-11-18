import { useSail } from "@rockooor/sail";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { InputText } from "../../../../common/inputs/InputText";
import { Modal } from "../../../../common/Modal";
export const UpdateThresholdModal = ({ isOpen, onDismiss, }) => {
    const { smartWallet, smartWalletData, key } = useSmartWallet();
    const [thresholdStr, setThresholdStr] = useState(smartWalletData?.account.threshold.toString() ?? "");
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const navigate = useNavigate();
    const numSigners = smartWalletData?.account.owners.length;
    const nextThreshold = (() => {
        try {
            return parseInt(thresholdStr);
        }
        catch (e) {
            return null;
        }
    })();
    useEffect(() => {
        setThresholdStr(smartWalletData?.account.threshold.toString() ?? "");
    }, [smartWalletData?.account.threshold]);
    return (React.createElement(Modal, { isOpen: isOpen, onDismiss: onDismiss, tw: "p-0" },
        React.createElement("div", { tw: "h-14 flex items-center px-8" },
            React.createElement("h1", { tw: "font-medium text-base" }, "Update Minimum Signers Threshold")),
        React.createElement("div", { tw: "px-8 py-6 grid gap-6" },
            React.createElement("label", { htmlFor: "threshold", tw: "flex flex-col gap-2 text-sm" },
                React.createElement("span", { tw: "font-medium" }, "Minimum Signers Threshold"),
                React.createElement(InputText, { id: "threshold", type: "number", placeholder: "Minimum number of signers", value: thresholdStr, onChange: (e) => {
                        setThresholdStr(e.target.value);
                    } })),
            React.createElement("div", null,
                React.createElement(AsyncButton, { variant: "primary", disabled: !nextThreshold || numSigners === undefined, onClick: async () => {
                        invariant(smartWallet, "smart wallet");
                        invariant(nextThreshold && numSigners);
                        if (numSigners < nextThreshold) {
                            notify({
                                message: `Threshold too high`,
                                description: `Threshold must be under the current number of signers, which is ${numSigners}. You specified ${nextThreshold}.`,
                            });
                        }
                        const tx = smartWallet.changeThreshold(parseInt(thresholdStr));
                        const pendingTX = await smartWallet.newTransaction({
                            instructions: tx.instructions,
                        });
                        notify({
                            message: `Updating minimum signers threshold to ${thresholdStr}`,
                            description: (React.createElement(React.Fragment, null,
                                "Proposing to set the minimum signers threshold to",
                                " ",
                                nextThreshold,
                                ". You may need to contact the other signers.")),
                        });
                        const { success, pending } = await handleTX(await wrapTx(pendingTX.tx), `Set minimum signers threshold to ${nextThreshold}`);
                        if (!success || !pending) {
                            return;
                        }
                        await pending.wait();
                        setThresholdStr("");
                        onDismiss();
                        navigate(`/wallets/${key.toString()}/tx/${pendingTX.index}`);
                    } }, "Update threshold")))));
};
