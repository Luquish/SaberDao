import { useKeypair, useTXHandlers } from "@rockooor/sail";
import { Keypair } from "@solana/web3.js";
import { SAVEWrapper } from "@tribecahq/save";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useProvider } from "@/hooks/tribeca/useProvider";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { formatDurationSeconds } from "@/utils/tribeca/format";
import { YupKeypair } from "@/utils/tribeca/validators/pubkey";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { LabeledInput } from "@/components/tribeca/common/inputs/LabeledInput";

interface SAVEForm {
  minLockDurationSeconds: number;
  saveMintKPStr: string;
}

const SAVEFormSchema = Yup.object().shape({
  minLockDurationSeconds: Yup.number().integer().required(),
  saveMintKPStr: YupKeypair.required(),
});

export const CreateSAVEForm: React.FC = () => {
  const { govToken, lockerData } = useGovernor();
  const { providerMut } = useProvider();
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    values,
    isSubmitting,
    isValid,
  } = useFormik<SAVEForm>({
    initialValues: {
      minLockDurationSeconds: 60 * 60 * 24 * 365,
      saveMintKPStr: JSON.stringify([...Keypair.generate().secretKey]),
    },
    validationSchema: SAVEFormSchema,
    onSubmit: async (values) => {
      if (!providerMut) {
        throw new Error("no wallet");
      }
      if (!lockerData) {
        throw new Error("no locker");
      }
      if (!govToken) {
        throw new Error("no gov token");
      }
      const { minLockDurationSeconds, saveMintKPStr } = values;
      const saveMintKP = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(saveMintKPStr) as number[])
      );
      const saveSDK = new SAVEWrapper(providerMut);
      const { tx } = await saveSDK.createSAVE({
        underlyingToken: govToken,
        locker: lockerData.publicKey,
        minLockDuration: minLockDurationSeconds,
        mintKP: saveMintKP,
      });
      await signAndConfirmTX(await wrapTx(tx), "Create SAVE");
    },
  });

  const saveMintKP = useKeypair(values.saveMintKPStr);

  return (
    <div className="px-7 py-5">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <LabeledInput
          Component={InputText}
          id="minLockDurationSeconds"
          label="Minimum Lock Duration (seconds)"
          type="number"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.minLockDurationSeconds}
          error={errors.minLockDurationSeconds}
          touched={touched.minLockDurationSeconds}
          footer={
            values.minLockDurationSeconds
              ? formatDurationSeconds(values.minLockDurationSeconds)
              : undefined
          }
        />
        <LabeledInput
          Component={InputText}
          type="text"
          id="saveMintKPStr"
          label="Save Mint Keypair"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.saveMintKPStr}
          error={errors.saveMintKPStr}
          touched={touched.saveMintKPStr}
          footer={saveMintKP?.publicKey.toString()}
        />
        <div>
          <AsyncButton type="submit" disabled={isSubmitting || !isValid}>
            Submit
          </AsyncButton>
        </div>
      </form>
    </div>
  );
};
