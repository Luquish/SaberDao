import { useTXHandlers } from "@rockooor/sail";
import { SNAPSHOTS_CODERS, SnapshotsSDK } from "@saberhq/snapshots";
import type { PublicKey } from "@solana/web3.js";

import { useMinBalanceRentExempt } from "../../../../../../../hooks/useMinBalanceRentExempt";
import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { AsyncButton } from "../../../../../../common/AsyncButton";

interface Props {
  escrow: PublicKey;
  era: number;
}

const escrowHistorySize = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(
  SNAPSHOTS_CODERS.Snapshots.idl.accounts[1]
);

export const CreateEscrowHistoryButton: React.FC<Props> = ({
  escrow,
  era,
}: Props) => {
  const { data: cost } = useMinBalanceRentExempt(escrowHistorySize);
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();
  return (
    <AsyncButton
      onClick={async (sdkMut) => {
        const sdk = SnapshotsSDK.load({ provider: sdkMut.provider });
        const { tx } = await sdk.snapshots.createEscrowHistory({
          escrow,
          era,
        });
        await signAndConfirmTX(
          await wrapTx(tx),
          `Create Escrow History for era ${era}`
        );
      }}
    >
      Create Escrow History (costs {cost?.formatUnits()})
    </AsyncButton>
  );
};
