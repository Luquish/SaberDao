import { Switch } from "@headlessui/react";
import { usePubkey, useSail, useToken, useUserATAs } from "@rockooor/sail";
import { createMemoInstruction } from "@saberhq/solana-contrib";
import { Token, TokenAmount } from "@saberhq/token-utils";
import { Keypair, PublicKey } from "@solana/web3.js";
import { VenkoSDK } from "@venkoapp/venko";
import { useFormik } from "formik";
import { useState } from "react";
import invariant from "tiny-invariant";
import React from 'react';
import * as Yup from "yup";
import { useSDK } from "@/contexts/sdk";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { kpSeedToKP, YupKeypair, YupPublicKey, } from "@/utils/tribeca/validators/pubkey";
import { Button } from "@/components/tribeca/common/Button";
import { InputText, Textarea } from "@/components/tribeca/common/inputs/InputText";
import { LabeledInput } from "@/components/tribeca/common/inputs/LabeledInput";
import { Section } from "@/components/tribeca/layout/WalletLayout/Section";
const formatDateInput = (date) => date.toISOString().split("Z")[0] ?? "";
const DEFAULT_STREAM = {
    token: "",
    amount: 0,
    start: formatDateInput(new Date()),
    cliff: "",
    end: formatDateInput(new Date(Date.now() + 1_000 * 525_600 * 60 * 2)),
    mintKPStr: JSON.stringify([...Keypair.generate().secretKey]),
    revocable: false,
    recipient: "",
};
const StreamFormSchema = Yup.object().shape({
    token: YupPublicKey.required(),
    amount: Yup.number().required(),
    start: Yup.date().required(),
    cliff: Yup.date(),
    end: Yup.date().required(),
    mintKPStr: YupKeypair.required(),
    revocable: Yup.boolean().required(),
    recipient: YupPublicKey.required(),
});
export const CreateStream = () => {
    const [memo, setMemo] = useState("");
    const { sdkMut } = useSDK();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const { values, handleSubmit, handleChange, handleBlur, setFieldValue, errors, touched, isSubmitting, isValid, } = useFormik({
        initialValues: DEFAULT_STREAM,
        validationSchema: StreamFormSchema,
        onSubmit: async (values, { resetForm }) => {
            invariant(sdkMut);
            const token = await Token.load(sdkMut.provider.connection, new PublicKey(values.token));
            if (!token) {
                throw new Error("not enough tokens");
            }
            const amount = TokenAmount.parse(token, values.amount.toString());
            const { venko } = VenkoSDK.load({ provider: sdkMut.provider });
            const { tx: createTX } = await venko.createStream({
                amount,
                startTS: Math.floor(new Date(values.start).getTime() / 1_000),
                cliffTS: values.cliff
                    ? Math.floor(new Date(values.cliff).getTime() / 1_000)
                    : undefined,
                endTS: Math.floor(new Date(values.end).getTime() / 1_000),
                mintKP: kpSeedToKP(values.mintKPStr),
                revoker: values.revocable
                    ? sdkMut.provider.wallet.publicKey
                    : undefined,
                recipient: new PublicKey(values.recipient),
            });
            if (memo !== "") {
                createTX.instructions.push(createMemoInstruction(memo));
            }
            const { pending, success } = await handleTX(await wrapTx(createTX), "Create Stream");
            if (!success || !pending) {
                return;
            }
            await pending.wait();
            resetForm();
        },
    });
    const { data: token } = useToken(usePubkey(values.token));
    const [balance] = useUserATAs(token);
    return (React.createElement("div", null,
        React.createElement(Section, { title: "Create Stream", description: "Issue a new Venko stream." },
            React.createElement("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit },
                React.createElement(LabeledInput, { id: "token", label: "Token Mint", Component: InputText, type: "text", onBlur: handleBlur, onChange: handleChange, error: errors.token ?? (token === null ? "Invalid token" : undefined), touched: touched.token }),
                React.createElement(LabeledInput, { Component: InputText, id: "amount", label: `Amount (you have ${balance?.balance.formatUnits() ?? "--"})`, type: "number", onBlur: handleBlur, onChange: handleChange, error: errors.amount, touched: touched.amount }),
                React.createElement(LabeledInput, { Component: InputText, id: "start", label: "Start", type: "datetime-local", value: values.start, onBlur: handleBlur, onChange: handleChange, error: errors.start, touched: touched.start }),
                React.createElement(LabeledInput, { id: "cliff", Component: InputText, label: "Cliff", type: "datetime-local", value: values.cliff, onBlur: handleBlur, onChange: handleChange, error: errors.cliff, touched: touched.cliff }),
                React.createElement(LabeledInput, { id: "end", Component: InputText, label: "End", type: "datetime-local", value: values.end, onBlur: handleBlur, onChange: handleChange, error: errors.end, touched: touched.end }),
                React.createElement(Switch.Group, null,
                    React.createElement("label", { className: "flex flex-col gap-1", htmlFor: "revocable" },
                        React.createElement(Switch.Label, { className: "text-sm" }, "Revocable?"),
                        React.createElement("div", { className: "flex items-center text-sm" },
                            React.createElement(Switch, { id: "revocable", checked: values.revocable, onChange: (checked) => {
                                    void setFieldValue("revocable", checked);
                                }, onBlur: handleBlur, className: `relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${values.revocable ? "bg-primary" : "bg-warmGray-600"}` },
                                React.createElement("span", { className: `inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${values.revocable ? "translate-x-6" : "translate-x-1"}` }))))),
                React.createElement(LabeledInput, { id: "mintKPStr", Component: Textarea, label: "Mint Keypair (string)", value: values.mintKPStr, onBlur: handleBlur, onChange: handleChange, error: errors.mintKPStr, touched: touched.mintKPStr }),
                React.createElement(LabeledInput, { id: "recipient", label: "Recipient", type: "text", placeholder: "Enter an address. (Not a token account!)", Component: InputText, value: values.recipient, onBlur: handleBlur, onChange: handleChange, error: errors.recipient, touched: touched.recipient }),
                React.createElement("div", { className: "flex flex-col gap-2 text-sm" },
                    React.createElement("span", { className: "font-medium" }, "Memo (optional)"),
                    React.createElement(InputText, { type: "text", value: memo, onChange: (e) => {
                            setMemo(e.target.value);
                        } })),
                React.createElement(Button, { variant: "primary", disabled: isSubmitting || !isValid }, "Submit")))));
};
