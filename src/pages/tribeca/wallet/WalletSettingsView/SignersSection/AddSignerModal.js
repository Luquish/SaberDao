import { useTXHandlers } from "@rockooor/sail";
import { PublicKey } from "@solana/web3.js";
import { FieldArray, Form, Formik } from "formik";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { notify } from "../../../../../utils/notifications";
import { Button } from "../../../../common/Button";
import { TextField } from "../../../../common/inputs/TextField";
import { Modal } from "../../../../common/Modal";
export const AddSignerModal = ({ isOpen, onDismiss, }) => {
    const { smartWallet, smartWalletData, key } = useSmartWallet();
    const { signAndConfirmTX } = useTXHandlers();
    const navigate = useNavigate();
    const { wrapTx } = useWrapTx();
    return (React.createElement(Modal, { isOpen: isOpen, onDismiss: onDismiss, tw: "p-0" },
        React.createElement("div", { tw: "h-14 flex items-center px-8" },
            React.createElement("h1", { tw: "font-medium text-base" }, "Modify signers")),
        React.createElement("div", { tw: "px-8 py-6 grid gap-6" },
            React.createElement(Formik, { initialValues: { signers: smartWalletData?.account.owners ?? [] }, onSubmit: async (values, helpers) => {
                    invariant(smartWallet, "smart wallet");
                    const signers = values.signers.map((s) => new PublicKey(s));
                    const tx = smartWallet.setOwners(signers);
                    const pendingTX = await smartWallet.newTransaction({
                        instructions: tx.instructions,
                    });
                    notify({
                        message: `Proposal: updating signers`,
                        description: (React.createElement(React.Fragment, null, "Proposing a transaction to modify the signers of the wallet. You may need to contact the other signers.")),
                    });
                    await signAndConfirmTX(await wrapTx(pendingTX.tx), `Propose updating signers`);
                    onDismiss();
                    helpers.resetForm();
                    navigate(`/wallets/${key.toString()}/tx/${pendingTX.index}`);
                }, render: ({ values, isSubmitting }) => (React.createElement(Form, null,
                    React.createElement(FieldArray, { name: "signers", render: (arrayHelpers) => (React.createElement("div", { tw: "flex flex-col gap-2" },
                            values.signers && values.signers.length > 0 ? (values.signers.map((_signer, index) => (React.createElement("div", { key: index, tw: "flex items-center gap-8" },
                                React.createElement("div", { tw: "flex-1" },
                                    React.createElement(TextField, { name: `signers.${index}` })),
                                React.createElement("div", { tw: "flex items-center gap-4" },
                                    React.createElement("button", { type: "button", onClick: () => arrayHelpers.remove(index) },
                                        React.createElement(FaMinus, null)),
                                    React.createElement("button", { type: "button", onClick: () => arrayHelpers.insert(index, "") },
                                        React.createElement(FaPlus, null))))))) : (React.createElement(Button, { type: "button", onClick: () => arrayHelpers.push("") }, "Add a signer")),
                            React.createElement("div", null,
                                React.createElement(Button, { type: "submit", disabled: isSubmitting }, "Submit")))) }))) }))));
};
