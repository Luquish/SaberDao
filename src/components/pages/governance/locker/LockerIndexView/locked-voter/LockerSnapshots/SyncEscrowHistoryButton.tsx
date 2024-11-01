import { useTXHandlers } from "@rockooor/sail";
import type { EscrowHistoryData, LockerHistoryData } from "@saberhq/snapshots";
import { SnapshotsSDK } from "@saberhq/snapshots";
import type { ProgramAccount } from "@saberhq/token-utils";

import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { AsyncButton } from "../../../../../../common/AsyncButton";

interface Props {
  lockerHistory: ProgramAccount<LockerHistoryData>;
  escrowHistory: ProgramAccount<EscrowHistoryData>;
}

export const SyncEscrowHistoryButton: React.FC<Props> = ({
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
