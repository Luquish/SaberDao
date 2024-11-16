import { useKeypair, useTXHandlers } from "@rockooor/sail";
import { Keypair } from "@solana/web3.js";
import { SAVEWrapper } from "@tribecahq/save";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { useProvider } from "../../../../../hooks/useProvider";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { formatDurationSeconds } from "../../../../../utils/format";
import { YupKeypair } from "../../../../../utils/validators/pubkey";
import { AsyncButton } from "../../../../common/AsyncButton";
import { InputText } from "../../../../common/inputs/InputText";
import { LabeledInput } from "../../../../common/inputs/LabeledInput";

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
    <div tw="px-7 py-5">
      <form onSubmit={handleSubmit} tw="grid gap-4">
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
