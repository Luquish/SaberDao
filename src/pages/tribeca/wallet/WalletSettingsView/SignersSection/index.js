import { useState } from "react";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { NamedAddressLink } from "../../../../common/account/NamedAddressLink";
import { Button } from "../../../../common/Button";
import { AddSignerModal } from "./AddSignerModal";
import { UpdateThresholdModal } from "./UpdateThresholdModal";
var SignerModal;
(function (SignerModal) {
    SignerModal[SignerModal["UpdateThreshold"] = 0] = "UpdateThreshold";
    SignerModal[SignerModal["AddSigner"] = 1] = "AddSigner";
})(SignerModal || (SignerModal = {}));
export const SignersSection = () => {
    const { smartWalletData } = useSmartWallet();
    const threshold = smartWalletData?.account?.threshold.toNumber();
    const [signerModal, setSignerModal] = useState(null);
    return (React.createElement("div", null,
        React.createElement(UpdateThresholdModal, { isOpen: signerModal === SignerModal.UpdateThreshold, onDismiss: () => {
                setSignerModal(null);
            } }),
        React.createElement(AddSignerModal, { isOpen: signerModal === SignerModal.AddSigner, onDismiss: () => {
                setSignerModal(null);
            } }),
        React.createElement("h2", { tw: "text-xl font-medium mb-1" }, "Signers"),
        React.createElement("p", { tw: "text-secondary text-sm" },
            "A proposed transaction may only be executed if ",
            threshold,
            " of these addresses approve it."),
        React.createElement("div", { tw: "my-6 flex items-center gap-4" },
            React.createElement(Button, { variant: "primary", onClick: () => {
                    setSignerModal(SignerModal.UpdateThreshold);
                } }, "Update Minimum Signers Threshold"),
            React.createElement(Button, { variant: "primary", onClick: () => {
                    setSignerModal(SignerModal.AddSigner);
                } }, "Add a signer")),
        React.createElement("div", { tw: "text-sm" }, smartWalletData?.account?.owners.map((owner, i) => {
            return (React.createElement("div", { key: `owner_${i}`, tw: "h-11 flex items-center justify-between border-b px-2" },
                React.createElement(NamedAddressLink, { address: owner, showCopy: true }),
                React.createElement(Button, { variant: "outline", size: "sm", tw: "text-xs h-7" }, "Remove")));
        }))));
};
