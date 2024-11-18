import { findWalletDerivedAddress } from "@gokiprotocol/client";
import { Switch } from "@headlessui/react";
import { useSail } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { Keypair, PublicKey } from "@solana/web3.js";
import { VenkoSDK } from "@venkoapp/venko";
import { useFormik } from "formik";
import invariant from "tiny-invariant";
import * as Yup from "yup";
import { Button } from "../../components/tribeca/common/Button";
import { InputText } from "../../components/tribeca/common/inputs/InputText";
import { LabeledInput } from "../../components/tribeca/common/inputs/LabeledInput";
import { Section } from "../../components/tribeca/layout/WalletLayout/Section";
import { useSDK } from "../../contexts/sdk";
import { useWrapTx } from "../../hooks/tribeca/useWrapTx";
import { YupKeypair, YupPublicKey } from "../../utils/tribeca/validators/pubkey";
import React from "react";
const formatDateInput = (date) => date.toISOString().split("Z")[0] ?? "";
const DEFAULT_STREAM = {
    amount: 0,
    start: formatDateInput(new Date()),
    cliff: "",
    end: formatDateInput(new Date(Date.now() + 1_000 * 525_600 * 60 * 2)),
    revocable: false,
    recipient: "",
};
const StreamFormSchema = Yup.object().shape({
    amount: Yup.number().required(),
    start: Yup.date().required(),
    cliff: Yup.date(),
    end: Yup.date().required(),
    mintKPStr: YupKeypair.required(),
    revocable: Yup.boolean().required(),
    recipient: YupPublicKey.required(),
});
export const GrantVenkoStreamForm = ({ actor, token, }) => {
    const { sdkMut } = useSDK();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { values, handleSubmit, handleChange, handleBlur, setFieldValue, errors, touched, isSubmitting, isValid, } = useFormik({
        initialValues: DEFAULT_STREAM,
        validationSchema: StreamFormSchema,
        onSubmit: async (values, { resetForm }) => {
            invariant(sdkMut);
            const [treasuryAddr] = await findWalletDerivedAddress(actor, 0);
            const amount = TokenAmount.parse(token, values.amount.toString());
            const { venko } = VenkoSDK.load({ provider: sdkMut.provider });
            const { tx: createTX } = await venko.createStream({
                amount,
                startTS: Math.floor(new Date(values.start).getTime() / 1_000),
                cliffTS: values.cliff
                    ? Math.floor(new Date(values.cliff).getTime() / 1_000)
                    : undefined,
                endTS: Math.floor(new Date(values.end).getTime() / 1_000),
                mintKP: Keypair.generate(),
                owner: treasuryAddr,
                revoker: values.revocable ? treasuryAddr : undefined,
                recipient: new PublicKey(values.recipient),
            });
            const { pending, success } = await handleTX(await wrapTx(createTX), "Create Stream");
            if (!success || !pending) {
                return;
            }
            await pending.wait();
            resetForm();
        },
    });
    return (React.createElement("div", null,
        React.createElement(Section, { title: "Create Stream", description: "Issue a new Venko stream." },
            React.createElement("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit },
                React.createElement(LabeledInput, { Component: InputText, id: "amount", label: "Amount", type: "number", onBlur: handleBlur, onChange: handleChange, error: errors.amount, touched: touched.amount }),
                React.createElement(LabeledInput, { Component: InputText, id: "start", label: "Start", type: "datetime-local", value: values.start, onBlur: handleBlur, onChange: handleChange, error: errors.start, touched: touched.start }),
                React.createElement(LabeledInput, { id: "cliff", Component: InputText, label: "Cliff", type: "datetime-local", value: values.cliff, onBlur: handleBlur, onChange: handleChange, error: errors.cliff, touched: touched.cliff }),
                React.createElement(LabeledInput, { id: "end", Component: InputText, label: "End", type: "datetime-local", value: values.end, onBlur: handleBlur, onChange: handleChange, error: errors.end, touched: touched.end }),
                React.createElement(Switch.Group, null,
                    React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "revocable" },
                        React.createElement(Switch.Label, { className: "text-sm" }, "Revocable?"),
                        React.createElement("div", { className: "flex items-center text-sm" },
                            React.createElement(Switch, { id: "revocable", checked: values.revocable, onChange: (checked) => {
                                    void setFieldValue("revocable", checked);
                                }, onBlur: handleBlur, className: [
                                    values.revocable ? "bg-primary" : "bg-warmGray-600",
                                    "relative inline-flex items-center h-6 rounded-full w-11 transition-colors",
                                ] },
                                React.createElement("span", { className: [
                                        values.revocable ? "translate-x-6" : "translate-x-1",
                                        "inline-block w-4 h-4 transform bg-white rounded-full transition-transform",
                                    ].join(" ") }))))),
                React.createElement(LabeledInput, { id: "recipient", label: "Recipient", type: "text", placeholder: "Enter an address. (Not a token account!)", Component: InputText, value: values.recipient, onBlur: handleBlur, onChange: handleChange, error: errors.recipient, touched: touched.recipient }),
                React.createElement(Button, { variant: "primary", disabled: isSubmitting || !isValid }, "Submit")))));
};
