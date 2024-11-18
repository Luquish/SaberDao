import { useTXHandlers } from "@rockooor/sail";
import { SNAPSHOTS_CODERS, SnapshotsSDK } from "@saberhq/snapshots";
import { useMinBalanceRentExempt } from "@/hooks/useMinBalanceRentExempt";
import { useWrapTx } from "@/hooks/useWrapTx";
import { AsyncButton } from "@/common/AsyncButton";
const lockerHistorySize = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(SNAPSHOTS_CODERS.Snapshots.idl.accounts[0]);
export const CreateLockerHistoryButton = ({ locker, era, }) => {
    const { data: cost } = useMinBalanceRentExempt(lockerHistorySize);
    const { signAndConfirmTX } = useTXHandlers();
    const { wrapTx } = useWrapTx();
    return (React.createElement(AsyncButton, { onClick: async (sdkMut) => {
            const sdk = SnapshotsSDK.load({ provider: sdkMut.provider });
            const { tx } = await sdk.snapshots.createLockerHistory({
                locker,
                era,
            });
            await signAndConfirmTX(await wrapTx(tx), `Create Locker History for era ${era}`);
        } },
        "Create Locker History (costs ",
        cost?.formatUnits(),
        ")"));
};
