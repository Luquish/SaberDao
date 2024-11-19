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
import {
  kpSeedToKP,
  YupKeypair,
  YupPublicKey,
} from "@/utils/tribeca/validators/pubkey";
import { Button } from "@/components/tribeca/common/Button";
import { InputText, Textarea } from "@/components/tribeca/common/inputs/InputText";
import LabeledInput from "@/components/tribeca/common/inputs/LabeledInput";
import Section from "@/components/tribeca/layout/WalletLayout/Section";

interface CreateStreamForm {
  token: string;
  amount: number;
  start: string;
  cliff: string;
  end: string;
  mintKPStr: string;
  revocable: boolean;
  recipient: string;
}

const formatDateInput = (date: Date): string =>
  date.toISOString().split("Z")[0] ?? "";

const DEFAULT_STREAM: CreateStreamForm = {
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

const CreateStream: React.FC = () => {
  const [memo, setMemo] = useState<string>("");
  const { sdkMut } = useSDK();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    touched,
    isSubmitting,
    isValid,
  } = useFormik<CreateStreamForm>({
    initialValues: DEFAULT_STREAM,
    validationSchema: StreamFormSchema,
    onSubmit: async (values: CreateStreamForm, { resetForm }: { resetForm: () => void }) => {
      invariant(sdkMut);
      const token = await Token.load(
        sdkMut.provider.connection,
        new PublicKey(values.token)
      );
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

      const { pending, success } = await handleTX(
        await wrapTx(createTX),
        "Create Stream"
      );
      if (!success || !pending) {
        return;
      }
      await pending.wait();
      resetForm();
    },
  });

  const { data: token } = useToken(usePubkey(values.token));
  const [balance] = useUserATAs(token);

  return (
    <div>
      <Section title="Create Stream" description="Issue a new Venko stream.">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <LabeledInput
            id="token"
            label="Token Mint"
            Component={InputText}
            type="text"
            onBlur={handleBlur}
            onChange={handleChange}
            error={
              errors.token ?? (token === null ? "Invalid token" : undefined)
            }
            touched={touched.token}
          />
          <LabeledInput
            Component={InputText}
            id="amount"
            label={`Amount (you have ${
              balance?.balance.formatUnits() ?? "--"
            })`}
            type="number"
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.amount}
            touched={touched.amount}
          />
          <LabeledInput
            Component={InputText}
            id="start"
            label="Start"
            type="datetime-local"
            value={values.start}
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.start}
            touched={touched.start}
          />
          <LabeledInput
            id="cliff"
            Component={InputText}
            label="Cliff"
            type="datetime-local"
            value={values.cliff}
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.cliff}
            touched={touched.cliff}
          />
          <LabeledInput
            id="end"
            Component={InputText}
            label="End"
            type="datetime-local"
            value={values.end}
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.end}
            touched={touched.end}
          />
          <Switch.Group>
            <label className="flex flex-col gap-1" htmlFor="revocable">
              <Switch.Label className="text-sm">Revocable?</Switch.Label>
              <div className="flex items-center text-sm">
                <Switch<"button">
                  id="revocable"
                  checked={values.revocable}
                  onChange={(checked: boolean) => {
                    void setFieldValue("revocable", checked);
                  }}
                  onBlur={handleBlur}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    values.revocable ? "bg-primary" : "bg-warmGray-600"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      values.revocable ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </Switch>
              </div>
            </label>
          </Switch.Group>
          <LabeledInput
            id="mintKPStr"
            Component={Textarea}
            label="Mint Keypair (string)"
            value={values.mintKPStr}
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.mintKPStr}
            touched={touched.mintKPStr}
          />
          <LabeledInput
            id="recipient"
            label="Recipient"
            type="text"
            placeholder="Enter an address. (Not a token account!)"
            Component={InputText}
            value={values.recipient}
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.recipient}
            touched={touched.recipient}
          />
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Memo (optional)</span>
            <InputText
              type="text"
              value={memo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMemo(e.target.value);
              }}
            />
          </div>
          <Button variant="primary" disabled={isSubmitting || !isValid}>
            Submit
          </Button>
        </form>
      </Section>
    </div>
  );
};

export default CreateStream;
