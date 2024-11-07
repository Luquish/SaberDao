import { findSubaccountInfoAddress } from "@gokiprotocol/client";
import { useTXHandlers } from "@rockooor/sail";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useSDK } from "../../contexts/sdk";
import {
  useBatchedSubaccountInfos,
  useGokiSmartWalletData,
} from "../../utils/parsers";
import { useOwnerInvokerAddress } from "../useSmartWalletAddress";
import { useWrapTx } from "../useWrapTx";
import { useGovernor } from "./useGovernor";

export const useExecutiveCouncil = () => {
  const { smartWallet } = useGovernor();
  const { data: smartWalletData } = useGokiSmartWalletData(smartWallet);
  const { sdkMut } = useSDK();
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();

  const { data: subaccountInfoKeys } = useQuery({
    queryKey: ["subaccountInfos", smartWalletData?.publicKey.toString()],
    queryFn: async () => {
      if (!smartWalletData) {
        return smartWalletData;
      }
      return await Promise.all(
        smartWalletData.account.owners.map(async (swOwner) => {
          const [sub] = await findSubaccountInfoAddress(swOwner);
          return sub;
        })
      );
    },
    enabled: !!smartWalletData,
  });

  const { data: subaccountInfos } =
    useBatchedSubaccountInfos(subaccountInfoKeys);

  const subaccountInfo = useMemo(
    () =>
      subaccountInfos?.find(
        (s) => s && "ownerInvoker" in s.account.subaccountType
      ),
    [subaccountInfos]
  );

  const ecKey = subaccountInfo?.account.smartWallet;
  const ecWallet = useGokiSmartWalletData(ecKey);

  const { data: ownerInvokerKey } = useOwnerInvokerAddress(ecKey, 0);

  const isMemberOfEC = !!(
    sdkMut &&
    ecWallet.data?.account.owners.find((o) =>
      o.equals(sdkMut.provider.wallet.publicKey)
    )
  );

  const buildOwnerInvokeTX = async (tx: TransactionEnvelope) => {
    if (!isMemberOfEC || !ecWallet.data || !subaccountInfo) {
      throw new Error("Not a member of the Executive Council");
    }
    const sw = await sdkMut.loadSmartWallet(ecWallet.data?.publicKey);
    const allTXs = await Promise.all(
      tx.instructions.map(async (instruction) => {
        return await sw.ownerInvokeInstructionV2({
          instruction,
          index: subaccountInfo.account.index.toNumber(),
        });
      })
    );
    const newTX = TransactionEnvelope.combineAll(...allTXs);
    newTX.addSigners(...tx.signers);
    return newTX;
  };

  const ownerInvokeTX = async (
    ...[tx, ...rest]: Parameters<typeof signAndConfirmTX>
  ) => {
    return await signAndConfirmTX(
      await wrapTx(await buildOwnerInvokeTX(tx)),
      ...rest
    );
  };

  return {
    ecWallet,
    isMemberOfEC,
    ownerInvokerKey,
    buildOwnerInvokeTX,
    ownerInvokeTX,
  };
};
