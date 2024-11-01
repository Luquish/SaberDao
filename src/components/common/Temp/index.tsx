/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { GokiSDK } from "@gokiprotocol/client";
import { useTXHandlers } from "@rockooor/sail";
import { PoolManagerSDK } from "@saberhq/pool-manager";
import { SABER_CODERS } from "@saberhq/saber-periphery";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { SWAP_PROGRAM_ID } from "@saberhq/stableswap-sdk";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { chunk } from "lodash-es";
import { useState } from "react";
import { FaSign } from "react-icons/fa";

import { useSDK } from "../../../contexts/sdk";
import { useExecutiveCouncil } from "../../../hooks/tribeca/useExecutiveCouncil";
import { GovernorProvider } from "../../../hooks/tribeca/useGovernor";
import { useProvider } from "../../../hooks/useProvider";
import { CardWithImage } from "../../common/governance/CardWithImage";
import { useGMData } from "../../pages/governance/gauges/hooks/useGaugemeister";
import { SABER_POOL_MANAGER } from "../../pages/governance/saber-pools/SaberPoolView";
import { AsyncButton } from "../AsyncButton";

const ownerInvokerSignTX = async (
  smKey: PublicKey,
  owner: PublicKey,
  sdkMut: GokiSDK,
  tx: TransactionEnvelope
) => {
  const sw = await sdkMut.loadSmartWallet(smKey);
  console.log(sw);
  const allTXs = await Promise.all(
    tx.instructions.map(async (instruction) => {
      return await sw.ownerInvokeInstructionV2({
        instruction,
        index: 0,
        owner,
      });
    })
  );
  const newTX = TransactionEnvelope.combineAll(...allTXs);
  newTX.addSigners(...tx.signers);
  return newTX;
};

export const GrantToEC: React.FC = () => {
  const { connection } = useConnection();
  const { data: gmData } = useGMData();
  const { provider } = useProvider();
  const { ownerInvokerKey } = useExecutiveCouncil();
  const { signAndConfirmTX } = useTXHandlers();
  const { sdkMut } = useSDK();
  const wallet = useAnchorWallet();
  const [sig, setSig] = useState<string | null>(null);
  const [tot, setTot] = useState<number>(0);
  const [cur, setCur] = useState<number>(0);

  if (!sdkMut) {
    return <></>;
  }

  const run = async () => {
    const poolManagerSDK = PoolManagerSDK.load({
      provider: sdkMut.provider,
    });
    const poolManager = await poolManagerSDK.loadManager(SABER_POOL_MANAGER);

    const pools = await poolManager.program.account.pool.all();

    const admin = pools
      .filter(
        (pool) =>
          pool.account.manager.toString() === SABER_POOL_MANAGER.toString()
      )
      .map((pool) =>
        poolManager.program.instruction.commitNewAdmin({
          accounts: {
            poolManager: poolManager.key,
            pool: pool.publicKey,
            swap: pool.account.swap,
            swapProgram: SWAP_PROGRAM_ID,
            admin: new PublicKey(
              "2a3mWszftJ9xkpSmmqZEjhNCjTgCMnXuRcJQHFUJXT9x"
            ),
            newAdmin: new PublicKey(
              "6g57y5PLqJNYKxB4ZGMgVrrxu1jMSr3FYDeL1m8kiwza"
            ),
          },
        })
      );

    const operator = poolManager.program.instruction.setOperator({
      accounts: {
        poolManager: poolManager.key,
        admin: new PublicKey("2a3mWszftJ9xkpSmmqZEjhNCjTgCMnXuRcJQHFUJXT9x"),
        operator: new PublicKey("CisJJST2EVYEfnihh4yMtoXRQLiTG93bZpcv83xJaGNT"),
      },
    });

    const beneficiary = poolManager.program.instruction.setBeneficiary({
      accounts: {
        poolManager: poolManager.key,
        admin: new PublicKey("2a3mWszftJ9xkpSmmqZEjhNCjTgCMnXuRcJQHFUJXT9x"),
        beneficiary: new PublicKey(
          "9Nim4EjhtkEwjQtP5KKmHQeXZ9JCznddeFxKgYwMzQAZ"
        ),
      },
    });

    const mintProxy = SABER_CODERS.MintProxy.getProgram(sdkMut.provider);
    const transferOwnershipTX = mintProxy.state.instruction.transferOwnership(
      new PublicKey("6g57y5PLqJNYKxB4ZGMgVrrxu1jMSr3FYDeL1m8kiwza"),
      {
        accounts: {
          owner: new PublicKey("2a3mWszftJ9xkpSmmqZEjhNCjTgCMnXuRcJQHFUJXT9x"),
        },
      }
    );

    const allTX = [transferOwnershipTX, operator, beneficiary, ...admin];

    const chunks = chunk(allTX, 5);
    setTot(chunks.length);
    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk) continue;
      setCur(i + 1);
      const tx = await ownerInvokerSignTX(
        new PublicKey("Hq1K3tCMzXVePh4ViNKA12PCcrtye3sqqLRWv79vb8hp"),
        new PublicKey("F4VFp4tFTyrQWo9YVjCbPE5eQP27ice2zyGDp2tN2Rkm"),
        sdkMut,
        TransactionEnvelope.create(provider, chunk)
      );

      const instructions = [
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 200000,
        }),
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 5000,
        }),
        ...tx.instructions,
      ];

      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey("F4VFp4tFTyrQWo9YVjCbPE5eQP27ice2zyGDp2tN2Rkm"),
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();
      const transaction = new VersionedTransaction(messageV0);

      console.log(Buffer.from(transaction.serialize()).toString("base64"));
      const signed = await wallet?.signTransaction(transaction);
      if (!signed) {
        throw new Error("Failed to sign transaction");
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      connection.sendRawTransaction(signed.serialize()).catch((e) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        connection.sendRawTransaction(signed.serialize());
      });
    }
  };

  return (
    <CardWithImage
      title="Update Pool Manager"
      image={
        <div tw="flex items-center justify-center h-full">
          <FaSign tw="w-20 h-20" />
        </div>
      }
    >
      <AsyncButton onClick={run}>Start transactions</AsyncButton>
      <div tw="text-sm text-gray-500">
        {cur} / {tot}
      </div>
    </CardWithImage>
  );
};

export const Temp: React.FC = () => {
  return (
    <div>
      <GovernorProvider>
        <GrantToEC />
      </GovernorProvider>
    </div>
  );
};
