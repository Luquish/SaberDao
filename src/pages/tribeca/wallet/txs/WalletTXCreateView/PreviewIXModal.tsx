import type { SmartWalletWrapper } from "@gokiprotocol/client";
import type { InstructionDisplay } from "@project-serum/anchor/dist/cjs/coder/borsh/instruction";
import { useSail } from "@rockooor/sail";
import {
  SignerWallet,
  SingleConnectionBroadcaster,
  SolanaProvider,
  TransactionEnvelope,
} from "@saberhq/solana-contrib";
import type {
  SimulatedTransactionResponse,
  TransactionInstruction,
} from "@solana/web3.js";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { startCase } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import invariant from "tiny-invariant";
import React from "react";

import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { Modal } from "@/components/tribeca/common/Modal";
import type { InstructionInfo } from ".";

interface Props {
  ix: InstructionInfo;
  txInstructions: TransactionInstruction[];
  formatted: InstructionDisplay;
  isOpen: boolean;
  onDismiss: () => void;
  smartWallet?: SmartWalletWrapper | null;
}

const PreviewIXModal: React.FC<Props> = ({
  ix,
  txInstructions,
  formatted,
  isOpen,
  smartWallet,
  onDismiss,
}: Props) => {
  const { network } = useEnvironment();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();

  // TODO(michael): Figure this out ...
  const rpcURL = process.env.RPC_URL ?? "https://api.devnet.solana.com";
  const readonlyKeypair = Keypair.generate();

  const txEnv = useMemo(() => {
    const theTX = new Transaction();
    theTX.instructions = txInstructions;
    theTX.feePayer =
      smartWallet?.provider.wallet.publicKey ?? readonlyKeypair.publicKey;
    const readonlyConnection = new Connection(rpcURL);

    return new TransactionEnvelope(
      smartWallet?.provider ??
        new SolanaProvider(
          readonlyConnection,
          new SingleConnectionBroadcaster(readonlyConnection),
          new SignerWallet(readonlyKeypair)
        ),
      txInstructions
    );
  }, [smartWallet, txInstructions, rpcURL, readonlyKeypair]);
  const [result, setResult] = useState<SimulatedTransactionResponse | null>(
    null
  );
  useEffect(() => {
    if (!txEnv) {
      return;
    }
    void (async () => {
      const theTX = txEnv.build();
      theTX.feePayer = txEnv.provider.wallet.publicKey;
      const simResult = await txEnv.provider.connection.simulateTransaction(
        theTX,
        undefined
      );
      setResult(simResult.value);
    })();

    return () => {
      setResult(null);
    };
  }, [txEnv]);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <div className="flex flex-col gap-6">
        <h2 className="font-semibold">Preview: {startCase(ix.instruction.name)}</h2>
        {formatted.args.length > 0 && (
          <div className="grid gap-4">
            <h3 className="font-semibold">Arguments</h3>
            <AttributeList
              attributes={formatted.args.reduce(
                (acc, el) => ({
                  ...acc,
                  [`${el.name} (${el.type})`]: el.data,
                }),
                {}
              )}
            />
          </div>
        )}
        <div className="grid gap-4">
          <h3 className="font-semibold">Accounts</h3>
          <AttributeList
            attributes={formatted.accounts.reduce(
              (acc, el) => ({
                ...acc,
                [el.name ?? el.pubkey.toString()]: el.pubkey,
              }),
              {}
            )}
          />
        </div>
        <div>
          <h3 className="font-semibold flex items-center gap-1">
            Simulated Output
            {result?.err && (
              <span className="bg-red-500 px-1 py-0.5 rounded text-white text-xs">
                error
              </span>
            )}
          </h3>
          <div className="relative w-full max-w-full font-mono">
            <div className="w-full max-w-full overflow-x-scroll text-xs whitespace-pre">
              {result?.logs?.join("\n")}
            </div>
          </div>
          {network !== "localnet" && (
            <a
              className="flex items-center text-primary gap-2"
              target="_blank"
              href={txEnv?.generateInspectLink(network) ?? ""}
              rel="noreferrer"
            >
              View on Solana Explorer <FaExternalLinkAlt />
            </a>
          )}
        </div>
        <div>
          {smartWallet && (
            <AsyncButton
              onClick={async () => {
                invariant(smartWallet, "smart wallet");
                const pendingTX = await smartWallet.newTransaction({
                  instructions: txInstructions,
                });

                await handleTX(
                  await wrapTx(pendingTX.tx),
                  `Propose ${startCase(ix.instruction.name)}`
                );
                onDismiss();
              }}
            >
              Propose Transaction
            </AsyncButton>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PreviewIXModal;
