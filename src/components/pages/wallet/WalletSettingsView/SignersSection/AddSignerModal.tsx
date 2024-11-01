import { useTXHandlers } from "@rockooor/sail";
import { PublicKey } from "@solana/web3.js";
import { FieldArray, Form, Formik } from "formik";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import invariant from "tiny-invariant";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { notify } from "../../../../../utils/notifications";
import { Button } from "../../../../common/Button";
import { TextField } from "../../../../common/inputs/TextField";
import { Modal } from "../../../../common/Modal";

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
  const navigate = useNavigate();
  const { wrapTx } = useWrapTx();

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} tw="p-0">
      <div tw="h-14 flex items-center px-8">
        <h1 tw="font-medium text-base">Modify signers</h1>
      </div>
      <div tw="px-8 py-6 grid gap-6">
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
                  <div tw="flex flex-col gap-2">
                    {values.signers && values.signers.length > 0 ? (
                      values.signers.map((_signer, index) => (
                        <div key={index} tw="flex items-center gap-8">
                          <div tw="flex-1">
                            <TextField name={`signers.${index}`} />
                          </div>
                          <div tw="flex items-center gap-4">
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
