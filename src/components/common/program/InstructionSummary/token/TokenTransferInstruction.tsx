import { useToken, useTokenAccount } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { useMemo } from "react";

import type { Transfer } from "../../../../../utils/instructions/token/types";
import { AddressLink } from "../../../AddressLink";
import { TokenAmountDisplay } from "../../../TokenAmountDisplay";

interface Props {
  transfer: Transfer;
}

export const TokenTransferInstruction: React.FC<Props> = ({
  transfer,
}: Props) => {
  const { data: recipientAccount } = useTokenAccount(transfer.destination);
  const { data: token } = useToken(recipientAccount?.account.mint);
  const amount = useMemo(
    () => (token ? new TokenAmount(token, transfer.amount) : null),
    [token, transfer.amount]
  );
  return (
    <div tw="inline-flex flex-wrap gap-1">
      Transfer{" "}
      {amount ? <TokenAmountDisplay tw="font-semibold" amount={amount} /> : ""}{" "}
      to{" "}
      <AddressLink
        tw="dark:text-primary dark:hover:text-white"
        address={recipientAccount?.account.owner ?? transfer.destination}
        showCopy
      />
    </div>
  );
};
