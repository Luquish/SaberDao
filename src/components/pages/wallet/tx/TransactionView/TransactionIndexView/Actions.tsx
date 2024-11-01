import { SmartWalletWrapper } from "@gokiprotocol/client";
import { useSail } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
import pluralize from "pluralize";
import invariant from "tiny-invariant";

import { useProvider } from "../../../../../../hooks/useProvider";
import { useSmartWallet } from "../../../../../../hooks/useSmartWallet";
import { useWrapTx } from "../../../../../../hooks/useWrapTx";
import {
  SABER_DAO_SMART_WALLET_KEY,
  SABER_EXECUTIVE_COUNCIL,
} from "../../../../../../utils/constants";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { Button } from "../../../../../common/Button";
import { useTransaction } from "../context";

export const Actions: React.FC = () => {
  const { state, id, tx, title, numSigned } = useTransaction();
  const { smartWallet, threshold, smartWalletData } = useSmartWallet();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const { providerMut } = useProvider();

  const { data: sbrExecutiveCouncilSmartWallet } = useQuery({
    queryKey: [],
    queryFn: async () => {
      invariant(smartWallet);
      return await SmartWalletWrapper.load(
        smartWallet.sdk,
        SABER_EXECUTIVE_COUNCIL
      );
    },
    enabled: !!smartWallet,
  });

  const isSBRExec = !!(
    sbrExecutiveCouncilSmartWallet?.data &&
    providerMut &&
    smartWallet?.key.equals(SABER_DAO_SMART_WALLET_KEY) &&
    sbrExecutiveCouncilSmartWallet.data.owners.find((o) =>
      o.equals(providerMut.wallet.publicKey)
    )
  );

  const isOwner = !!(
    providerMut &&
    smartWalletData?.account.owners.find((o) =>
      o.equals(providerMut.wallet.publicKey)
    )
  );

  return (
    <>
      {state === "active" && (
        <div tw="p-4 border w-full my-4 text-sm flex flex-col gap-4">
          <div>
            <h2 tw="font-medium mb-1.5">More Signatures Required</h2>
            <p tw="text-secondary text-xs">
              This transaction still requires {(threshold ?? 0) - numSigned}{" "}
              more {pluralize("signature", (threshold ?? 0) - numSigned)} to be
              able to executed.
            </p>
          </div>
          {isOwner && (
            <div>
              <Button
                variant="primary"
                onClick={async () => {
                  invariant(smartWallet, "smart wallet");
                  const txEnv = smartWallet.approveTransaction(tx.publicKey);
                  await handleTX(
                    await wrapTx(txEnv),
                    `Approve ${id}: ${title}`
                  );
                }}
              >
                Approve
              </Button>
            </div>
          )}
          {isSBRExec && (
            <div>
              <Button
                variant="primary"
                onClick={async () => {
                  invariant(smartWallet, "smart wallet");
                  const ownerInvokerIndex = 0;
                  const [sbrOwnerInvoker] =
                    await sbrExecutiveCouncilSmartWallet.findOwnerInvokerAddress(
                      ownerInvokerIndex
                    );
                  const txEnv = smartWallet.approveTransaction(
                    tx.publicKey,
                    sbrOwnerInvoker
                  );
                  invariant(txEnv.instructions[0]);
                  const approveAsInvoker =
                    await sbrExecutiveCouncilSmartWallet.ownerInvokeInstructionV2(
                      {
                        instruction: txEnv.instructions[0],
                        index: ownerInvokerIndex,
                      }
                    );
                  await handleTX(
                    await wrapTx(approveAsInvoker),
                    `Approve ${id}: ${title}`
                  );
                }}
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      )}
      {state === "approved" && (
        <div tw="p-4 border w-full my-4 text-sm flex flex-col gap-4">
          <div>
            <h2 tw="font-medium mb-1.5">Transaction Approved</h2>
            <p tw="text-secondary text-xs">
              The transaction has been approved by the minimum number of
              signers.
            </p>
          </div>
          {isOwner && (
            <div>
              <AsyncButton
                variant="primary"
                onClick={async () => {
                  invariant(smartWallet, "smart wallet");
                  const txEnv = await smartWallet.executeTransaction({
                    transactionKey: tx.publicKey,
                  });
                  await handleTX(
                    await wrapTx(txEnv),
                    `Execute ${id}: ${title}`
                  );
                }}
              >
                Execute {id}
              </AsyncButton>
            </div>
          )}
          {isSBRExec && (
            <AsyncButton
              variant="primary"
              onClick={async () => {
                invariant(smartWallet, "smart wallet");
                const ownerInvokerIndex = 0;
                const [sbrOwnerInvoker] =
                  await sbrExecutiveCouncilSmartWallet.findOwnerInvokerAddress(
                    ownerInvokerIndex
                  );
                const txEnv = await smartWallet.executeTransaction({
                  transactionKey: tx.publicKey,
                  owner: sbrOwnerInvoker,
                });
                invariant(txEnv.instructions[0]);
                const executeAsInvoker =
                  await sbrExecutiveCouncilSmartWallet.ownerInvokeInstructionV2(
                    {
                      instruction: txEnv.instructions[0],
                      index: ownerInvokerIndex,
                    }
                  );
                await handleTX(
                  await wrapTx(executeAsInvoker),
                  `Execute ${id}: ${title}`
                );
              }}
            >
              Execute {id}
            </AsyncButton>
          )}
        </div>
      )}
    </>
  );
};
