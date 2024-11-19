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
      const last = arr[arr.length - 1] as string | undefined;
      if (!last) {
        return true;
      }
      try {
        new PublicKey(last);
        return true;
      } catch (e) {
        return false;
      }
    }),
  threshold: Yup.number().min(1, "Must have at least one signer required"),
  maxOwners: Yup.number()
    .required()
    .test((v: number, valuesRaw: Yup.TestContext): boolean | Yup.ValidationError => {
      const values = valuesRaw.parent as CreateFormValues;
      if (typeof v !== "number") {
        return new Yup.ValidationError("Invalid");
      }
      if (v < values.owners.length) {
        return new Yup.ValidationError(
          "Must have more max owners than the initial amount"
        );
      }
      return true;
    }),
  baseKP: Yup.string()
    .required("Required")
    .test("baseKP", "Invalid keypair JSON", (str: string) => {
      if (!str) {
        return false;
      }
      try {
        Keypair.fromSecretKey(Uint8Array.from(JSON.parse(str) as number[]));
        return true;
      } catch (e) {
        return false;
      }
    }),
  delay: Yup.number().min(0, "Delay must be positive"),
});

interface CreateFormValues {
  owners: string[];
  threshold: number;
  maxOwners: number;
  baseKP: string;
  delay?: number;
}

const WalletCreateView: React.FC = () => {
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const { sdkMut } = useSDK();
  const initialBaseKP = useMemo(
    () => JSON.stringify([...Keypair.generate().secretKey]),
    []
  );
  const formik = useFormik<CreateFormValues>({
    initialValues: {
      owners: [],
      threshold: 1,
      maxOwners: 10,
      baseKP: initialBaseKP,
      delay: 0,
    },
    validationSchema: CreateFormSchema,
    onSubmit: async (values: CreateFormValues) => {
      try {
        invariant(sdkMut, "sdk");
        const baseKP = Keypair.fromSecretKey(
          Uint8Array.from(JSON.parse(values.baseKP) as number[])
        );
        const { tx, smartWalletWrapper } = await sdkMut.newSmartWallet({
          owners: uniq(values.owners)
            .filter((x) => !!x)
            .map((owner) => new PublicKey(owner)),
          threshold: new BN(values.threshold),
          numOwners: values.maxOwners,
          base: baseKP,
          delay: values.delay ? new BN(values.delay) : undefined,
        });
        const { pending, success } = await handleTX(
          await wrapTx(tx),
          "Create Multisig"
        );
        if (!success || !pending) {
          return;
        }
        await pending.wait({ commitment: "confirmed" });

        notify({
          message: `Wallet created successfully`,
          description: smartWalletWrapper.key.toString(),
        });
        navigate(`/wallets/${smartWalletWrapper.key.toString()}`);
      } catch (e) {
        handleException(e, {
          source: "create-multisig",
        });
      }
    },
  });

  const keypair = useKeypair(formik.values.baseKP);
  const walletKey = useSmartWalletAddress(keypair?.publicKey);

  return (
    <div className="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div className="mb-8">
          <h1 className="font-bold text-3xl mb-4">Let's create a wallet</h1>
          <h2 className="text-secondary font-medium text-sm">
            Goki Smart Wallet is a secure multisig wallet for managing funds and
            admin privileges.
          </h2>
        </div>
        <div>
          <form className="grid grid-cols-1 gap-6" onSubmit={formik.handleSubmit}>
            <label htmlFor="nextOwner">
              <span>Owners</span>
              {formik.values.owners.length > 1 && (
                <div>
                  {formik.values.owners.slice(0, -1).map((owner: string, i: number) => (
                    <div key={owner} className="flex items-center justify-between">
                      <span>
                        <AddressLink address={new PublicKey(owner)} showCopy />
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextOwners = formik.values.owners.slice();
                          nextOwners.splice(i, 1);
                          void formik.setFieldValue("owners", nextOwners);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-1">
                <InputText
                  id="nextOwner"
                  name="nextOwner"
                  type="text"
                  className="mt-1 w-full"
                  placeholder="Enter an address"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    void formik.setFieldValue("owners", [
                      ...formik.values.owners.slice(0, -1),
                      e.target.value,
                    ]);
                  }}
                  onBlur={() => {
                    void formik.setFieldTouched("owners");
                  }}
                  value={
                    formik.values.owners[formik.values.owners.length - 1] ?? ""
                  }
                />
                <Button
                  type="button"
                  disabled={
                    !formik.values.owners[formik.values.owners.length - 1]
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const last =
                      formik.values.owners[formik.values.owners.length - 1];
                    invariant(last, "last");
                    try {
                      new PublicKey(last);
                      void formik.setFieldValue("owners", [
                        ...formik.values.owners,
                        "",
                      ]);
                    } catch (e) {
                      void formik.setFieldTouched("owners", true);
                    }
                  }}
                  className="mt-1"
                  variant="muted"
                >
                  <FaPlus />
                </Button>
              </div>
              {formik.touched.owners && formik.errors.owners && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.owners}</div>
              )}
            </label>
            <label>
              <div className="flex items-center gap-2">
                <span>Minimum Signer Threshold</span>
                <MouseoverTooltip
                  text={
                    <div className="max-w-sm">
                      <p>
                        The minimum number of signers required to execute a
                        transaction.
                      </p>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle className="h-3 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <InputText
                name="threshold"
                type="number"
                inputMode="numeric"
                className="mt-1 w-full"
                placeholder="Enter an integer"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  formik.setFieldValue('threshold', value);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.threshold}
              />
              {formik.touched.threshold && formik.errors.threshold && (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.threshold}
                </div>
              )}
            </label>
            <label>
              <div className="flex items-center gap-2">
                <span>Maximum number of signers</span>
                <MouseoverTooltip
                  text={
                    <div className="max-w-sm">
                      <p>
                        The maximum number of signers that can ever be
                        registered in this wallet.
                      </p>
                      <small>
                        Solana accounts have a fixed size, so this number must
                        be known ahead of time.
                      </small>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle className="h-3 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <InputText
                name="maxOwners"
                type="number"
                inputMode="numeric"
                className="mt-1 w-full"
                placeholder="Enter an integer"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  formik.setFieldValue('maxOwners', value);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.maxOwners}
              />
              {formik.touched.maxOwners && formik.errors.maxOwners && (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.maxOwners}
                </div>
              )}
            </label>
            <label>
              <div className="flex items-center gap-2">
                <span>Base Keypair JSON</span>
                <MouseoverTooltip
                  text={
                    <div className="max-w-sm">
                      <p>
                        The JSON secret key to use as the base for the Multisig
                        wallet. Use this to create a wallet with a deterministic
                        address across multiple chains.
                      </p>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle className="h-3 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <Textarea
                name="baseKP"
                className="mt-1 block w-full h-24"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => formik.setFieldValue('baseKP', e.target.value)}
                onBlur={formik.handleBlur}
                value={formik.values.baseKP}
              />
              {formik.touched.baseKP && formik.errors.baseKP && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.baseKP}</div>
              )}
            </label>
            <label>
              <div className="flex items-center gap-2">
                <span>Timelock Delay (optional)</span>
                <MouseoverTooltip
                  text={
                    <div className="max-w-sm">
                      <p>
                        The minimum duration to wait between the time an
                        instruction is scheduled and the time an instruction can
                        be executed.
                      </p>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle className="h-3 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <InputText
                name="delay"
                type="number"
                inputMode="numeric"
                className="mt-1 w-full"
                placeholder="Delay (seconds)"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  formik.setFieldValue('delay', value);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.delay}
              />
              {formik.touched.delay && formik.errors.delay && (
                <div className="text-red-500 text-sm mt-2">{formik.errors.delay}</div>
              )}
            </label>
            <div className="rounded p-4 border">
              <h3 className="mb-4 uppercase text-secondary text-sm">Details</h3>
              <AttributeList
                attributes={{
                  "Wallet Address": walletKey.data ? walletKey.data : "--",
                }}
              />
            </div>
            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Create Wallet
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WalletCreateView;
