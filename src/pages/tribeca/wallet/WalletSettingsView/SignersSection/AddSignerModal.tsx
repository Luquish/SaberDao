import { useTXHandlers } from "@rockooor/sail";
import { PublicKey } from "@solana/web3.js";
import { FieldArray, Form, Formik } from "formik";
import { FaMinus, FaPlus } from "react-icons/fa";
import { navigate } from "@reach/router";
import invariant from "tiny-invariant";
import React from "react";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { notify } from "@/utils/tribeca/notifications";
import { Button } from "@/components/tribeca/common/Button";
import { TextField } from "@/components/tribeca/common/inputs/TextField";
import { Modal } from "@/components/tribeca/common/Modal";

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

export const AddSignerModal: React.FC<Props> = ({
  isOpen,
  onDismiss,
}: Props) => {
  const { smartWallet, smartWalletData, key } = useSmartWallet();
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} className="p-0">
      <div className="h-14 flex items-center px-8">
        <h1 className="font-medium text-base">Modify signers</h1>
      </div>
      <div className="px-8 py-6 grid gap-6">
        <Formik
          initialValues={{ signers: smartWalletData?.account.owners ?? [] }}
          onSubmit={async (values, helpers) => {
            invariant(smartWallet, "smart wallet");
            const signers = values.signers.map((s) => new PublicKey(s));

            const tx = smartWallet.setOwners(signers);
            const pendingTX = await smartWallet.newTransaction({
              instructions: tx.instructions,
            });

            notify({
              message: `Proposal: updating signers`,
              description: (
                <>
                  Proposing a transaction to modify the signers of the wallet.
                  You may need to contact the other signers.
                </>
              ),
            });
            await signAndConfirmTX(
              await wrapTx(pendingTX.tx),
              `Propose updating signers`
            );

            onDismiss();
            helpers.resetForm();
            navigate(`/wallets/${key.toString()}/tx/${pendingTX.index}`);
          }}
          render={({ values, isSubmitting }) => (
            <Form>
              <FieldArray
                name="signers"
                render={(arrayHelpers) => (
                  <div className="flex flex-col gap-2">
                    {values.signers && values.signers.length > 0 ? (
                      values.signers.map((_signer, index) => (
                        <div key={index} className="flex items-center gap-8">
                          <div className="flex-1">
                            <TextField name={`signers.${index}`} />
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <FaMinus />
                            </button>
                            <button
                              type="button"
                              onClick={() => arrayHelpers.insert(index, "")}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        {/* show this when user has removed all signers from the list */}
                        Add a signer
                      </Button>
                    )}
                    <div>
                      <Button type="submit" disabled={isSubmitting}>
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        />
      </div>
    </Modal>
  );
};
