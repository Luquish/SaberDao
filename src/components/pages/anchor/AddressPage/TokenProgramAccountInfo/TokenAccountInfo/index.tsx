import { useToken } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import type { TokenAccountData } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import type { KeyedAccountInfo } from "@solana/web3.js";

import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { DisplayValue } from "../../../../../common/DisplayValue";
import { Card } from "../../../../../common/governance/Card";
import { AddressWithContext } from "../../../../../common/program/AddressWithContext";
import { HistoricalBalances } from "./HistoricalBalances";

interface Props {
  raw: KeyedAccountInfo;
  data: TokenAccountData;
}

export const TokenAccountInfo: React.FC<Props> = ({ raw, data }: Props) => {
  const { data: token } = useToken(data.mint);
  const balance = mapSome(token, (t) => new TokenAmount(t, data.amount));

  return (
    <>
      <Card title="SPL Token Account">
        <TableCardBody rightAlignEnd>
          <tr>
            <th>Owner</th>
            <td>
              <AddressWithContext pubkey={data.owner} />
            </td>
          </tr>
          <tr>
            <th>Balance</th>
            <td>
              <div tw="flex justify-end">
                <DisplayValue value={balance} />
              </div>
            </td>
          </tr>
        </TableCardBody>
      </Card>
      {token && (
        <HistoricalBalances token={token} tokenAccount={raw.accountId} />
      )}
    </>
  );
};
