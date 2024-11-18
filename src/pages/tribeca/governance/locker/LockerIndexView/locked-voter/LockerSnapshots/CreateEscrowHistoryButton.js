import { useTXHandlers } from "@rockooor/sail";
import { SNAPSHOTS_CODERS, SnapshotsSDK } from "@saberhq/snapshots";
import { useMinBalanceRentExempt } from "@/hooks/useMinBalanceRentExempt";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AsyncButton } from "@/common/AsyncButton";
const escrowHistorySize = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(SNAPSHOTS_CODERS.Snapshots.idl.accounts[1]);
export const CreateEscrowHistoryButton = ({ escrow, era, }) => {
    const { data: cost } = useMinBalanceRentExempt(escrowHistorySize);
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    return (React.createElement(AsyncButton, { onClick: async (sdkMut) => {
            const sdk = SnapshotsSDK.load({ provider: sdkMut.provider });
            const { tx } = await sdk.snapshots.createEscrowHistory({
                escrow,
                era,
            });
            await signAndConfirmTX(await wrapTx(tx), `Create Escrow History for era ${era}`);
        } },
        "Create Escrow History (costs ",
        cost?.formatUnits(),
        ")"));
};
