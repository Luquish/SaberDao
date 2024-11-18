import { useTXHandlers } from "@rockooor/sail";
import { SnapshotsSDK } from "@saberhq/snapshots";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AsyncButton } from "@/common/AsyncButton";
export const SyncEscrowHistoryButton = ({ lockerHistory, escrowHistory, }) => {
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    return (React.createElement(AsyncButton, { onClick: async (sdkMut) => {
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
        } }, "Sync Escrow History"));
};
