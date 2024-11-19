import { useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import React from "react";

import type { TransferChecked } from "@/utils/tribeca/instructions/token/types";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import LoadingSpinner from "@/components/tribeca/common/LoadingSpinner";
import { TokenAmountDisplay } from "@/components/tribeca/common/TokenAmountDisplay";
import Box from "@/components/tribeca/common/Box";

interface Props {
  data: TransferChecked;
}

const Transfer: React.FC<Props> = ({
  data: {
    mint,
    tokenAmount: { amount },
    destination,
  },
}: Props) => {
  const { data: token } = useToken(mint);
  const amt = token ? new TokenAmount(token, amount) : token;

  return (
    <Box title="Summary">
      {amt ? (
        <div className="inline-flex items-center gap-2">
          Transfer <TokenAmountDisplay amount={amt} showIcon /> to{" "}
          <AddressLink address={destination} />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Box>
  );
};

export default Transfer;
