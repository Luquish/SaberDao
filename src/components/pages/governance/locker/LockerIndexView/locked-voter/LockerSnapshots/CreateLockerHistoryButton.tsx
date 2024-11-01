import { useTXHandlers } from "@rockooor/sail";
import { SNAPSHOTS_CODERS, SnapshotsSDK } from "@saberhq/snapshots";
import type { PublicKey } from "@solana/web3.js";

import { useMinBalanceRentExempt } from "../../../../../../../hooks/useMinBalanceRentExempt";
import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { AsyncButton } from "../../../../../../common/AsyncButton";

interface Props {
  locker: PublicKey;
  era: number;
}

const lockerHistorySize = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(
  SNAPSHOTS_CODERS.Snapshots.idl.accounts[0]
);

export const CreateLockerHistoryButton: React.FC<Props> = ({
  locker,
  era,
}: Props) => {
  const { data: cost } = useMinBalanceRentExempt(lockerHistorySize);
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();
  return (
    <AsyncButton
      onClick={async (sdkMut) => {
        const sdk = SnapshotsSDK.load({ provider: sdkMut.provider });
        const { tx } = await sdk.snapshots.createLockerHistory({
          locker,
          era,
        });
        await signAndConfirmTX(
          await wrapTx(tx),
          `Create Locker History for era ${era}`
        );
      }}
    >
      Create Locker History (costs {cost?.formatUnits()})
    </AsyncButton>
  );
};
