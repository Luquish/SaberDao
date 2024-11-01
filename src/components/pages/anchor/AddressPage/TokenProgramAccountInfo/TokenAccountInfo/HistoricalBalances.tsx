import type { Token } from "@saberhq/token-utils";
import type { PublicKey } from "@solana/web3.js";

import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { Card } from "../../../../../common/governance/Card";
import { BalanceDiff } from "./BalanceDiff";
import { useSignaturesForAddress } from "./fetchHistoricalBalances";

interface Props {
  tokenAccount: PublicKey;
  token: Token;
}

export const HistoricalBalances: React.FC<Props> = ({
  token,
  tokenAccount,
}: Props) => {
  const { data: signatures } = useSignaturesForAddress(tokenAccount);
  return (
    <Card title="Balance History" bodyScrollX>
      <div tw="whitespace-nowrap">
        <TableCardBody
          head={
            <tr>
              <th>Time</th>
              <th>Pre</th>
              <th>Post</th>
              <th>Signature</th>
            </tr>
          }
        >
          {signatures &&
            signatures.map((sig) => {
              return (
                <BalanceDiff
                  key={sig.signature}
                  token={token}
                  tokenAccount={tokenAccount}
                  signature={sig.signature}
                />
              );
            })}
        </TableCardBody>
      </div>
    </Card>
  );
};
