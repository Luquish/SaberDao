import { useToken } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import { TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";

import { AddressLink } from "../../../../common/AddressLink";
import { AddressWithContext } from "../../../../common/program/AddressWithContext";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { TXLink } from "../../../../common/TXLink";
import type { RawCashioSolanaReimbursement } from "./useCashioHackUBOInfo";

interface Props {
  reimbursement: RawCashioSolanaReimbursement;
}

export const ReimbursementRow: React.FC<Props> = ({ reimbursement }: Props) => {
  const { data: token } = useToken(reimbursement.mint);
  const amount = mapSome(
    token,
    (t) => new TokenAmount(t, reimbursement.amount)
  );
  return (
    <tr>
      <td>
        <AddressWithContext
          tw="items-start"
          pubkey={new PublicKey(reimbursement.destinationOwner)}
        />
      </td>
      <td>
        {amount && (
          <TokenAmountDisplay
            tw="text-white font-semibold"
            amount={amount}
            showIcon
          />
        )}
      </td>
      <td>
        <AddressLink
          address={new PublicKey(reimbursement.destination)}
          showCopy
        />
      </td>
      <td>
        <TXLink txSig={reimbursement.signature} full />
      </td>
    </tr>
  );
};
