import { useSail } from "@rockooor/sail";
import React, { useEffect, useState } from "react";
import { navigate } from "@reach/router";
import invariant from "tiny-invariant";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { notify } from "@/utils/tribeca/notifications";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { Modal } from "@/components/tribeca/common/Modal";

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

export const UpdateThresholdModal: React.FC<Props> = ({
  isOpen,
  onDismiss,
}: Props) => {
  const { smartWallet, smartWalletData, key } = useSmartWallet();
  const [thresholdStr, setThresholdStr] = useState<string>(
    smartWalletData?.account.threshold.toString() ?? ""
  );
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();

  const numSigners = smartWalletData?.account.owners.length;
  const nextThreshold = (() => {
    try {
      return parseInt(thresholdStr);
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    setThresholdStr(smartWalletData?.account.threshold.toString() ?? "");
  }, [smartWalletData?.account.threshold]);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} className="p-0">
      <div className="h-14 flex items-center px-8">
        <h1 className="font-medium text-base">
          Update Minimum Signers Threshold
        </h1>
      </div>
      <div className="px-8 py-6 grid gap-6">
        <label htmlFor="threshold" className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Minimum Signers Threshold</span>
          <InputText
            id="threshold"
            type="number"
            placeholder="Minimum number of signers"
            value={thresholdStr}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setThresholdStr(e.target.value);
            }}
          />
        </label>
        <div>
          <AsyncButton
            variant="primary"
            disabled={!nextThreshold || numSigners === undefined}
            onClick={async () => {
              invariant(smartWallet, "smart wallet");
              invariant(nextThreshold && numSigners);

              if (numSigners < nextThreshold) {
                notify({
                  message: `Threshold too high`,
                  description: `Threshold must be under the current number of signers, which is ${numSigners}. You specified ${nextThreshold}.`,
                });
              }

              const tx = smartWallet.changeThreshold(parseInt(thresholdStr));
              const pendingTX = await smartWallet.newTransaction({
                instructions: tx.instructions,
              });

              notify({
                message: `Updating minimum signers threshold to ${thresholdStr}`,
                description: (
                  <>
                    Proposing to set the minimum signers threshold to{" "}
                    {nextThreshold}. You may need to contact the other signers.
                  </>
                ),
              });
              const { success, pending } = await handleTX(
                await wrapTx(pendingTX.tx),
                `Set minimum signers threshold to ${nextThreshold}`
              );

              if (!success || !pending) {
                return;
              }
              await pending.wait();

              setThresholdStr("");
              onDismiss();
              navigate(`/wallets/${key.toString()}/tx/${pendingTX.index}`);
            }}
          >
            Update threshold
          </AsyncButton>
        </div>
      </div>
    </Modal>
  );
};
