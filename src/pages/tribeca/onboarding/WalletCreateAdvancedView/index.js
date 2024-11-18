import { useSail } from "@rockooor/sail";
import { Keypair, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useFormik } from "formik";
import { uniq } from "lodash-es";
import { useMemo } from "react";
import { FaPlus, FaQuestionCircle, FaTrash } from "react-icons/fa";
import { navigate } from "@reach/router";
import invariant from "tiny-invariant";
import * as Yup from "yup";
import React from "react";
import { useSDK } from "@/contexts/sdk";
import { useKeypair } from "@/hooks/tribeca/useKeypair";
import { useSmartWalletAddress } from "@/hooks/tribeca/useSmartWalletAddress";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { handleException } from "@/utils/tribeca/error";
import { notify } from "@/utils/notifications";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { Button } from "@/components/tribeca/common/Button";
import { InputText, Textarea } from "@/components/tribeca/common/inputs/InputText";
import { MouseoverTooltip } from "@/components/tribeca/common/MouseoverTooltip";
const CreateFormSchema = Yup.object().shape({
    owners: Yup.array()
        .min(1, "Enter at least one owner")
        .test("invalidKey", "Invalid key", (arr) => {
        if (!arr) {
            return false;
        }
        const last = arr[arr.length - 1];
        if (!last) {
            return true;
        }
        try {
            new PublicKey(last);
            return true;
        }
        catch (e) {
            return false;
        }
    }),
    threshold: Yup.number().min(1, "Must have at least one signer required"),
    maxOwners: Yup.number()
        .required()
        .test((v, valuesRaw) => {
        const values = valuesRaw.parent;
        if (typeof v !== "number") {
            return new Yup.ValidationError("Invalid");
        }
        if (v < values.owners.length) {
            return new Yup.ValidationError("Must have more max owners than the initial amount");
        }
        return true;
    }),
    baseKP: Yup.string()
        .required("Required")
        .test("baseKP", "Invalid keypair JSON", (str) => {
        if (!str) {
            return false;
        }
        try {
            Keypair.fromSecretKey(Uint8Array.from(JSON.parse(str)));
            return true;
        }
        catch (e) {
            return false;
        }
    }),
    delay: Yup.number().min(0, "Delay must be positive"),
});
export const WalletCreateView = () => {
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { sdkMut } = useSDK();
    const initialBaseKP = useMemo(() => JSON.stringify([...Keypair.generate().secretKey]), []);
    const formik = useFormik({
        initialValues: {
            owners: [],
            threshold: 1,
            maxOwners: 10,
            baseKP: initialBaseKP,
            delay: 0,
        },
        validationSchema: CreateFormSchema,
        onSubmit: async (values) => {
            try {
                invariant(sdkMut, "sdk");
                const baseKP = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(values.baseKP)));
                const { tx, smartWalletWrapper } = await sdkMut.newSmartWallet({
                    owners: uniq(values.owners)
                        .filter((x) => !!x)
                        .map((owner) => new PublicKey(owner)),
                    threshold: new BN(values.threshold),
                    numOwners: values.maxOwners,
                    base: baseKP,
                    delay: values.delay ? new BN(values.delay) : undefined,
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
        },
    });
    const keypair = useKeypair(formik.values.baseKP);
    const walletKey = useSmartWalletAddress(keypair?.publicKey);
    return (React.createElement("div", { className: "grid gap-12 w-full max-w-sm mx-auto" },
        React.createElement("div", null,
            React.createElement("div", { className: "mb-8" },
                React.createElement("h1", { className: "font-bold text-3xl mb-4" }, "Let's create a wallet"),
                React.createElement("h2", { className: "text-secondary font-medium text-sm" }, "Goki Smart Wallet is a secure multisig wallet for managing funds and admin privileges.")),
            React.createElement("div", null,
                React.createElement("form", { className: "grid grid-cols-1 gap-6", onSubmit: formik.handleSubmit },
                    React.createElement("label", { htmlFor: "nextOwner" },
                        React.createElement("span", null, "Owners"),
                        formik.values.owners.length > 1 && (React.createElement("div", null, formik.values.owners.slice(0, -1).map((owner, i) => (React.createElement("div", { key: owner, className: "flex items-center justify-between" },
                            React.createElement("span", null,
                                React.createElement(AddressLink, { address: new PublicKey(owner), showCopy: true })),
                            React.createElement("button", { type: "button", onClick: () => {
                                    const nextOwners = formik.values.owners.slice();
                                    nextOwners.splice(i, 1);
                                    void formik.setFieldValue("owners", nextOwners);
                                } },
                                React.createElement(FaTrash, null))))))),
                        React.createElement("div", { className: "flex gap-1" },
                            React.createElement(InputText, { id: "nextOwner", name: "nextOwner", type: "text", className: "mt-1 w-full", placeholder: "Enter an address", onChange: (e) => {
                                    void formik.setFieldValue("owners", [
                                        ...formik.values.owners.slice(0, -1),
                                        e.target.value,
                                    ]);
                                }, onBlur: () => {
                                    void formik.setFieldTouched("owners");
                                }, value: formik.values.owners[formik.values.owners.length - 1] ?? "" }),
                            React.createElement(Button, { type: "button", disabled: !formik.values.owners[formik.values.owners.length - 1], onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const last = formik.values.owners[formik.values.owners.length - 1];
                                    invariant(last, "last");
                                    try {
                                        new PublicKey(last);
                                        void formik.setFieldValue("owners", [
                                            ...formik.values.owners,
                                            "",
                                        ]);
                                    }
                                    catch (e) {
                                        void formik.setFieldTouched("owners", true);
                                    }
                                }, className: "mt-1", variant: "muted" },
                                React.createElement(FaPlus, null))),
                        formik.touched.owners && formik.errors.owners && (React.createElement("div", { className: "text-red-500 text-sm mt-2" }, formik.errors.owners))),
                    React.createElement("label", null,
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("span", null, "Minimum Signer Threshold"),
                            React.createElement(MouseoverTooltip, { text: React.createElement("div", { className: "max-w-sm" },
                                    React.createElement("p", null, "The minimum number of signers required to execute a transaction.")), placement: "bottom-start" },
                                React.createElement(FaQuestionCircle, { className: "h-3 cursor-pointer" }))),
                        React.createElement(InputText, { name: "threshold", type: "number", inputMode: "numeric", className: "mt-1 w-full", placeholder: "Enter an integer", onChange: (e) => {
                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                formik.setFieldValue('threshold', value);
                            }, onBlur: formik.handleBlur, value: formik.values.threshold }),
                        formik.touched.threshold && formik.errors.threshold && (React.createElement("div", { className: "text-red-500 text-sm mt-2" }, formik.errors.threshold))),
                    React.createElement("label", null,
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("span", null, "Maximum number of signers"),
                            React.createElement(MouseoverTooltip, { text: React.createElement("div", { className: "max-w-sm" },
                                    React.createElement("p", null, "The maximum number of signers that can ever be registered in this wallet."),
                                    React.createElement("small", null, "Solana accounts have a fixed size, so this number must be known ahead of time.")), placement: "bottom-start" },
                                React.createElement(FaQuestionCircle, { className: "h-3 cursor-pointer" }))),
                        React.createElement(InputText, { name: "maxOwners", type: "number", inputMode: "numeric", className: "mt-1 w-full", placeholder: "Enter an integer", onChange: (e) => {
                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                formik.setFieldValue('maxOwners', value);
                            }, onBlur: formik.handleBlur, value: formik.values.maxOwners }),
                        formik.touched.maxOwners && formik.errors.maxOwners && (React.createElement("div", { className: "text-red-500 text-sm mt-2" }, formik.errors.maxOwners))),
                    React.createElement("label", null,
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("span", null, "Base Keypair JSON"),
                            React.createElement(MouseoverTooltip, { text: React.createElement("div", { className: "max-w-sm" },
                                    React.createElement("p", null, "The JSON secret key to use as the base for the Multisig wallet. Use this to create a wallet with a deterministic address across multiple chains.")), placement: "bottom-start" },
                                React.createElement(FaQuestionCircle, { className: "h-3 cursor-pointer" }))),
                        React.createElement(Textarea, { name: "baseKP", className: "mt-1 block w-full h-24", onChange: (e) => formik.setFieldValue('baseKP', e.target.value), onBlur: formik.handleBlur, value: formik.values.baseKP }),
                        formik.touched.baseKP && formik.errors.baseKP && (React.createElement("div", { className: "text-red-500 text-sm mt-2" }, formik.errors.baseKP))),
                    React.createElement("label", null,
                        React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("span", null, "Timelock Delay (optional)"),
                            React.createElement(MouseoverTooltip, { text: React.createElement("div", { className: "max-w-sm" },
                                    React.createElement("p", null, "The minimum duration to wait between the time an instruction is scheduled and the time an instruction can be executed.")), placement: "bottom-start" },
                                React.createElement(FaQuestionCircle, { className: "h-3 cursor-pointer" }))),
                        React.createElement(InputText, { name: "delay", type: "number", inputMode: "numeric", className: "mt-1 w-full", placeholder: "Delay (seconds)", onChange: (e) => {
                                const value = e.target.value === '' ? '' : Number(e.target.value);
                                formik.setFieldValue('delay', value);
                            }, onBlur: formik.handleBlur, value: formik.values.delay }),
                        formik.touched.delay && formik.errors.delay && (React.createElement("div", { className: "text-red-500 text-sm mt-2" }, formik.errors.delay))),
                    React.createElement("div", { className: "rounded p-4 border" },
                        React.createElement("h3", { className: "mb-4 uppercase text-secondary text-sm" }, "Details"),
                        React.createElement(AttributeList, { attributes: {
                                "Wallet Address": walletKey.data ? walletKey.data : "--",
                            } })),
                    React.createElement("div", null,
                        React.createElement(Button, { type: "submit", variant: "primary", size: "md", disabled: formik.isSubmitting || !formik.isValid }, "Create Wallet")))))));
};
export default WalletCreateView;
