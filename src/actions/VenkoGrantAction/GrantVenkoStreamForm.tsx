import { findWalletDerivedAddress } from "@gokiprotocol/client";
import { Switch } from "@headlessui/react";
import { useSail } from "@rockooor/sail";
import type { Token } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import { Keypair, PublicKey } from "@solana/web3.js";
import { VenkoSDK } from "@venkoapp/venko";
import { useFormik } from "formik";
import invariant from "tiny-invariant";
import * as Yup from "yup";

import { Button } from "@/components/tribeca/common/Button";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import LabeledInput from "@/components/tribeca/common/inputs/LabeledInput";
import Section from "@/components/tribeca/layout/WalletLayout/Section";
import { useSDK } from "@/contexts/sdk";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { YupKeypair, YupPublicKey } from "@/utils/tribeca/validators/pubkey";
import React from "react";
interface CreateStreamForm {
  amount: number;
  start: string;
  cliff: string;
  end: string;
  revocable: boolean;
  /**
   * Recipient of the Stream tokens.
   */
  recipient: string;
}

const formatDateInput = (date: Date): string =>
  date.toISOString().split("Z")[0] ?? "";

const DEFAULT_STREAM: CreateStreamForm = {
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

interface Props {
  actor: PublicKey;
  token: Token;
}

export default function GrantVenkoStreamForm({
  actor,
  token,
}: Props) {
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

  return (
    <div>
      <Section title="Create Stream" description="Issue a new Venko stream.">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <LabeledInput
            Component={InputText}
            id="amount"
            label="Amount"
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
                  className={
                    values.revocable ? "bg-primary" : "bg-warmGray-600"
                  }
                >
                  <span
                    className={[
                      values.revocable ? "translate-x-6" : "translate-x-1",
                      "inline-block w-4 h-4 transform bg-white rounded-full transition-transform",
                    ].join(" ")}
                  />
                </Switch>
              </div>
            </label>
          </Switch.Group>
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
          <Button variant="primary" disabled={isSubmitting || !isValid}>
            Submit
          </Button>
        </form>
      </Section>
    </div>
  );
};