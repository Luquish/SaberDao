import { SmartWalletWrapper } from "@gokiprotocol/client";
import { useTXHandlers } from "@rockooor/sail";
import type { PublicKey } from "@solana/web3.js";
import copyToClipboard from "copy-to-clipboard";
import filesize from "filesize";
import { FaDownload, FaRegCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import type { ProgramDeployBuffer } from "../../../../../hooks/useAuthorityPrograms";
import { truncateShasum } from "../../../../../hooks/useSha256Sum";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import {
  SABER_DAO_SMART_WALLET_KEY,
  SABER_EMERGENCY_DAO,
} from "../../../../../utils/constants";
import {
  createCloseInstruction,
  createUpgradeInstruction,
} from "../../../../../utils/instructions/upgradeable_loader/instructions";
import { notify } from "../../../../../utils/notifications";
import { AddressLink } from "../../../../common/AddressLink";
import { AsyncButton } from "../../../../common/AsyncButton";

interface Props {
  buffer: ProgramDeployBuffer;
  programID: PublicKey;
}

export const BufferCard: React.FC<Props> = ({ buffer, programID }: Props) => {
  const { sdkMut } = useSDK();
  const { smartWallet, key, path } = useSmartWallet();
  const { signAndConfirmTX } = useTXHandlers();
  const navigate = useNavigate();
  const { wrapTx } = useWrapTx();
  const { verifiableBuild } = buffer;

  return (
    <div tw="flex items-center justify-between rounded bg-gray-50 border px-3 py-2 text-sm">
      <div tw="flex flex-grow gap-4">
        <div tw="flex-basis[125px] flex items-center font-medium">
          <AddressLink address={buffer.pubkey} />
        </div>
        <div>
          <div tw="flex items-center gap-1 text-secondary">
            <button
              tw="hover:text-primary flex items-center gap-1"
              onClick={() => {
                const blob = new Blob([buffer.executableData], {
                  type: "application/octet-stream",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                const fileName = `goki-${buffer.pubkey.toString()}.so`;
                link.download = fileName;
                link.click();
              }}
            >
              <span>Download ({filesize(buffer.dataLen)})</span>
              <FaDownload />
            </button>
          </div>
          <div tw="text-xs inline-flex gap-1 text-secondary">
            SHA256:{" "}
            <button
              type="button"
              tw="flex items-center gap-0.5 text-gray-800 max-w-[200px] hover:(text-primary underline)"
              onClick={() => {
                copyToClipboard(buffer.sha256Sum);
                notify({
                  message: `Copied SHA256 hash to clipboard.`,
                  description: (
                    <>
                      You may verify the hash locally with{" "}
                      <code>sha256sum &lt;PROGRAM_FILEPATH&gt;</code>.
                    </>
                  ),
                });
              }}
            >
              <span tw="overflow-hidden overflow-ellipsis flex-grow-0">
                {truncateShasum(buffer.sha256Sum, 8)}
              </span>
              <div tw="flex-grow w-4 h-4 flex items-center">
                <FaRegCopy />
              </div>
            </button>
          </div>
          {verifiableBuild && (
            <div tw="text-xs inline-flex gap-1 text-secondary">
              <span>Build:</span>
              <a
                tw="hover:underline"
                href={verifiableBuild.build.build.source}
                target="_blank"
                rel="noreferrer"
              >
                {verifiableBuild.program.name}:{verifiableBuild.build.build.org}
                /{verifiableBuild.build.build.repoName}@
                {verifiableBuild.build.build.tag}
              </a>
            </div>
          )}
        </div>
      </div>
      <div tw="flex flex-col gap-1 flex-shrink-0">
        {sdkMut && (
          <>
            <AsyncButton
              variant="default"
              size="sm"
              onClick={async () => {
                invariant(smartWallet);
                const { tx, index } = await smartWallet.newTransaction({
                  instructions: [
                    await createUpgradeInstruction({
                      program: programID,
                      buffer: buffer.pubkey,
                      spill: smartWallet.provider.wallet.publicKey,
                      signer: key,
                    }),
                  ],
                });
                await signAndConfirmTX(await wrapTx(tx), `Propose Upgrade`);
                navigate(`${path}/tx/${index}`);
              }}
            >
              Upgrade
            </AsyncButton>
            {smartWallet?.key.equals(SABER_DAO_SMART_WALLET_KEY) && (
              <AsyncButton
                variant="default"
                size="sm"
                onClick={async () => {
                  invariant(smartWallet);

                  const emergencyDAOWallet = await SmartWalletWrapper.load(
                    smartWallet.sdk,
                    SABER_EMERGENCY_DAO
                  );

                  const { tx: innerTx } = await smartWallet.newTransaction({
                    proposer: emergencyDAOWallet.key,
                    instructions: [
                      await createUpgradeInstruction({
                        program: programID,
                        buffer: buffer.pubkey,
                        spill: emergencyDAOWallet.provider.wallet.publicKey,
                        signer: key,
                      }),
                    ],
                  });
                  const { tx, index } = await emergencyDAOWallet.newTransaction(
                    {
                      instructions: innerTx.instructions,
                    }
                  );
                  invariant(tx.instructions[0]);
                  const ownerInvokerIndex = 0;
                  const executeTx =
                    await emergencyDAOWallet.ownerInvokeInstructionV2({
                      instruction: tx.instructions[0],
                      index: ownerInvokerIndex,
                    });
                  await signAndConfirmTX(
                    await wrapTx(executeTx),
                    `Propose Upgrade`
                  );
                  navigate(
                    `/wallets/${emergencyDAOWallet.key.toString()}/tx/${index}`
                  );
                }}
              >
                Upgrade as Emergency DAO
              </AsyncButton>
            )}
          </>
        )}
        <AsyncButton
          variant="default"
          size="sm"
          onClick={async () => {
            invariant(smartWallet);
            const { tx, index } = await smartWallet.newTransaction({
              instructions: [
                createCloseInstruction({
                  account: buffer.pubkey,
                  spill: smartWallet.provider.walletKey,
                  authority: key,
                }),
              ],
            });
            await signAndConfirmTX(await wrapTx(tx), `Propose Close`);
            navigate(`${path}/tx/${index}`);
          }}
        >
          Close
        </AsyncButton>
      </div>
    </div>
  );
};
