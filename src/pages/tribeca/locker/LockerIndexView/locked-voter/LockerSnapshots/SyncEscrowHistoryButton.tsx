import { useTXHandlers } from "@rockooor/sail";
import type { EscrowHistoryData, LockerHistoryData } from "@saberhq/snapshots";
import { SnapshotsSDK } from "@saberhq/snapshots";
import type { ProgramAccount } from "@saberhq/token-utils";
import React from "react";

import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";

interface Props {
  lockerHistory: ProgramAccount<LockerHistoryData>;
  escrowHistory: ProgramAccount<EscrowHistoryData>;
}

const SyncEscrowHistoryButton: React.FC<Props> = ({
  lockerHistory,
  escrowHistory,
}: Props) => {
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();
  return (
    <AsyncButton
      onClick={async (sdkMut) => {
        const sdk = SnapshotsSDK.load({ provider: sdkMut.provider });
        const tx = sdk.provider.newTX([
          sdk.snapshots.program.instruction.sync({
            accounts: {
              locker: lockerHistory.account.locker,
              escrow: escrowHistory.account.escrow,
              lockerHistory: lockerHistory.publicKey,
              escrowHistory: escrowHistory.publicKey,
            },
          }),
        ]);
        await signAndConfirmTX(await wrapTx(tx), `Sync Escrow History`);
      }}
    >
      Sync Escrow History
    </AsyncButton>
  );
};

export default SyncEscrowHistoryButton;
