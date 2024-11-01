import { useQuarrySDK } from "@rockooor/react-quarry";
import { useSail } from "@rockooor/sail";
import { Saber, SABER_IOU_MINT, SBR_ADDRESS } from "@saberhq/saber-periphery";
import type { PublicKey } from "@solana/web3.js";

import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { AddressLink } from "../../../../../../common/AddressLink";
import { AsyncButton } from "../../../../../../common/AsyncButton";
import { Card } from "../../../../../../common/governance/Card";

interface Props {
  iouMint?: PublicKey;
}

export const InitializeRedeemer: React.FC<Props> = ({
  iouMint = SABER_IOU_MINT,
}: Props) => {
  const { sdkMut } = useQuarrySDK();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  return (
    <Card title="Initialize Redeemer" padded>
      <p>
        Redeemer does not yet exist for <AddressLink address={iouMint} />.
      </p>
      <AsyncButton
        disabled={!sdkMut}
        onClick={async (sdkMut) => {
          const redeemerSDK = Saber.load({ provider: sdkMut.provider });
          const { tx } = await redeemerSDK.createRedeemer({
            iouMint,
            redemptionMint: SBR_ADDRESS,
          });
          await handleTX(await wrapTx(tx), "Create Redeemer");
        }}
      >
        Initialize
      </AsyncButton>
    </Card>
  );
};
