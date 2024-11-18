import { findOwnerInvokerAddress, findSmartWallet } from "@gokiprotocol/client";
import { useSail } from "@rockooor/sail";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { createLocker, findGovernorAddress } from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { useFormik } from "formik";
import { useMemo } from "react";
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
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { InputText, Textarea } from "@/components/tribeca/common/inputs/InputText";

const DAY = 86_400;
interface CustomDAOFormValues {
  govTokenMintStr: string;
  execBaseKP: string;
  sosBaseKP: string;
  govBaseKP: string;
  govWalletBaseKP: string;
  lockerBaseKP: string;
}

const validateKeyPair = (kpStr?: string) => {
  if (!kpStr) {
    return false;
  }
  try {
    return !!kpSeedToKP(kpStr);
  } catch (e) {
    return false;
  }
};

const kpSeedToKP = (secretKey: string): Keypair => {
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(secretKey) as number[])
  );
};

const CustomDAOFormSchema = Yup.object().shape({
  govTokenMintStr: Yup.string()
    .required("Required")
    .test("Required", "Invalid public key", (str) => {
      if (!str) {
        return false;
      }

      try {
        new PublicKey(str);
      } catch (e) {
        return false;
      }
      return true;
    }),
  execBaseKP: Yup.string()
    .required("Required")
    .test("execBaseKP", "Invalid keypair JSON", (str) => {
      return validateKeyPair(str);
    }),
  sosBaseKP: Yup.string()
    .required("Required")
    .test("sosBaseKP", "Invalid keypair JSON", (str) => {
      return validateKeyPair(str);
    }),
  govBaseKP: Yup.string()
    .required("Required")
    .test("govBaseKP", "Invalid keypair JSON", (str) => {
      return validateKeyPair(str);
    }),
  govWalletBaseKP: Yup.string()
    .required("Required")
    .test("govWalletBaseKP", "Invalid keypair JSON", (str) => {
      return validateKeyPair(str);
    }),
  lockerBaseKP: Yup.string()
    .required("Required")
    .test("lockerBaseKP", "Invalid keypair JSON", (str) => {
      return validateKeyPair(str);
    }),
});

export const DAOCustomView: React.FC = () => {
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const { sdkMut, tribecaMut } = useSDK();

  const initialBaseKPs = useMemo(
    () =>
      new Array(5)
        .fill(null)
        .map(() => JSON.stringify([...Keypair.generate().secretKey])),
    []
  );

  const formik = useFormik<CustomDAOFormValues>({
    initialValues: {
      govTokenMintStr: "",
      execBaseKP: initialBaseKPs[0] as string,
      sosBaseKP: initialBaseKPs[1] as string,
      govBaseKP: initialBaseKPs[2] as string,
      govWalletBaseKP: initialBaseKPs[3] as string,
      lockerBaseKP: initialBaseKPs[4] as string,
    },
    validationSchema: CustomDAOFormSchema,
    onSubmit: async (values) => {
      try {
        invariant(sdkMut, "sdk");
        invariant(tribecaMut, "sdk");

        const execBaseKP = kpSeedToKP(values.execBaseKP);
        const [executive] = await findSmartWallet(execBaseKP.publicKey);
        const [ownerInvoker] = await findOwnerInvokerAddress(executive, 0);

        const sosBaseKP = kpSeedToKP(values.sosBaseKP);
        const [emergencyDAO] = await findSmartWallet(sosBaseKP.publicKey);

        const govBaseKP = kpSeedToKP(values.govBaseKP);
        const [governorKey] = await findGovernorAddress(govBaseKP.publicKey);

        const lockerBaseKP = kpSeedToKP(values.govBaseKP);
        const govWalletBaseKP = kpSeedToKP(values.govWalletBaseKP);

        const doCreateLocker = await createLocker({
          sdk: tribecaMut,
          gokiSDK: sdkMut,
          govTokenMint: new PublicKey(values.govTokenMintStr),
          governorBaseKP: govBaseKP,
          lockerBaseKP: lockerBaseKP,
          owners: [emergencyDAO, ownerInvoker],
          governanceParameters: {
            quorumVotes: new BN(400_000_000_000000), // 400M veSBR
            votingDelay: new BN(DAY),
            votingPeriod: new BN(3 * DAY),
            timelockDelaySeconds: new BN(DAY), // One day
          },
          lockerParams: {
            maxStakeVoteMultiplier: 10,
            minStakeDuration: new BN(7 * DAY),
            maxStakeDuration: new BN(5 * 365 * DAY),
            proposalActivationMinVotes: new BN(10_000_000_000000), // 10M veSBR,
            whitelistEnabled: true,
          },
          smartWalletBaseKP: govWalletBaseKP,
        });

        for (const { title, tx } of doCreateLocker.createTXs) {
          notify({
            message: `${title}`,
          });
          const { pending, success } = await handleTX(await wrapTx(tx), title);
          if (!success || !pending) {
            return;
          }
          await pending.wait({ commitment: "confirmed" });
        }

        const subaccountTX = await sdkMut.createSubaccountInfo({
          smartWallet: executive,
          index: 0,
          type: "ownerInvoker",
        });

        const { pending, success } = await handleTX(
          await wrapTx(subaccountTX),
          "Register owner invoker"
        );
        if (!success || !pending) {
          return;
        }
        await pending.wait({ commitment: "confirmed" });

        notify({
          message: `DAO created successfully`,
          description: "",
        });
        navigate(`/gov/${governorKey.toString()}`);
      } catch (e) {
        handleException(e, {
          source: "custom-dao",
        });
      }
    },
  });

  const execKP = useKeypair(formik.values.execBaseKP);
  const execKey = useSmartWalletAddress(execKP?.publicKey);
  const sosKP = useKeypair(formik.values.sosBaseKP);
  const sosKey = useSmartWalletAddress(sosKP?.publicKey);
  const govWallketKP = useKeypair(formik.values.govWalletBaseKP);
  const govWalletKey = useSmartWalletAddress(govWallketKP?.publicKey);

  const govKP = useKeypair(formik.values.govBaseKP);
  const govKey = useQuery({
    queryKey: ["governorKey", govKP],
    queryFn: async () => {
      invariant(govKP);
      const [address] = await findGovernorAddress(govKP.publicKey);
      return address;
    },
    enabled: !!govKP,
  });

  const lockerKP = useKeypair(formik.values.lockerBaseKP);
  const lockerKey = useQuery({
    queryKey: ["lockerKey", lockerKP],
    queryFn: async () => {
      invariant(lockerKP);
      const [address] = await findGovernorAddress(lockerKP.publicKey);
      return address;
    },
    enabled: !!lockerKP,
  });

  return (
    <div className="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div className="mb-8">
          <h1 className="font-bold text-2xl mb-4 dark:text-gray-50">
            Create Custom DAO
          </h1>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col w-full">
            <form
              className="grid grid-cols-1 gap-6 w-full"
              onSubmit={formik.handleSubmit}
            >
              <label className="flex flex-col" htmlFor="govTokenMint">
                <span className="text-xs mb-1">Governance Token Mint</span>
                <InputText
                  id="govTokenMintStr"
                  name="govTokenMintStr"
                  type="text"
                  className="mt-1 w-full"
                  placeholder="Enter an address"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    void formik.setFieldValue(
                      "govTokenMintStr",
                      e.target.value
                    );
                  }}
                  onBlur={() => {
                    void formik.setFieldTouched("govTokenMintStr");
                  }}
                  value={formik.values.govTokenMintStr}
                />
              </label>

              <label className="flex flex-col">
                <span className="text-xs w-full mb-1">
                  Executive Council Base Keypair JSON
                </span>
                <Textarea
                  name="execBaseKP"
                  className="mt-1 block w-full h-24"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.execBaseKP}
                />
                {formik.touched.execBaseKP && formik.errors.execBaseKP && (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.execBaseKP}
                  </div>
                )}
              </label>

              <label>
                <span className="text-xs w-full mb-1">
                  Emergency DAO Base Keypair JSON
                </span>
                <Textarea
                  name="sosBaseKP"
                  className="mt-1 block w-full h-24"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sosBaseKP}
                />
                {formik.touched.sosBaseKP && formik.errors.sosBaseKP && (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.sosBaseKP}
                  </div>
                )}
              </label>

              <label>
                <span className="text-xs w-full mb-1">Governor Base Keypair JSON</span>
                <Textarea
                  name="govBaseKP"
                  className="mt-1 block w-full h-24"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.govBaseKP}
                />
                {formik.touched.govBaseKP && formik.errors.govBaseKP && (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.govBaseKP}
                  </div>
                )}
              </label>

              <label>
                <span className="text-xs w-full mb-1">
                  Governance Wallet Base Keypair JSON
                </span>
                <Textarea
                  name="govWalletBaseKP"
                  className="mt-1 block w-full h-24"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.govWalletBaseKP}
                />
                {formik.touched.govWalletBaseKP &&
                  formik.errors.govWalletBaseKP && (
                    <div className="text-red-500 text-sm mt-2">
                      {formik.errors.govWalletBaseKP}
                    </div>
                  )}
              </label>

              <label>
                <span className="text-xs w-full mb-1">Locker Base Keypair JSON</span>
                <Textarea
                  name="lockerBaseKP"
                  className="mt-1 block w-full h-24"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lockerBaseKP}
                />
                {formik.touched.lockerBaseKP && formik.errors.lockerBaseKP && (
                  <div className="text-red-500 text-sm mt-2">
                    {formik.errors.lockerBaseKP}
                  </div>
                )}
              </label>

              <div className="rounded mt-8 p-4 border">
                <h3 className="mb-4 uppercase text-secondary text-sm">Details</h3>
                <AttributeList
                  attributes={{
                    "Executive Council Wallet": execKey.data ?? "--",
                    "Emergency DAO Wallet": sosKey.data ?? "--",
                    "Governance Wallet": govWalletKey.data ?? "--",
                    Governor: govKey.data ?? "--",
                    Locker: lockerKey.data ?? "--",
                  }}
                />
              </div>

              <div className="flex mt-8 items-center justify-center ">
                <AsyncButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Launch DAO
                </AsyncButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAOCustomView;
