import { mapSome } from "@saberhq/solana-contrib";
import type { Token } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import type { PublicKey, TransactionSignature } from "@solana/web3.js";

import { DisplayValue } from "../../../../../common/DisplayValue";
import { TXLink } from "../../../../../common/TXLink";
import { useParsedTransaction } from "./useParsedTransaction";

interface Props {
  token: Token;
  tokenAccount: PublicKey;
  signature: TransactionSignature;
}

export const BalanceDiff: React.FC<Props> = ({
  token,
  tokenAccount,
  signature,
}: Props) => {
  const { data } = useParsedTransaction(signature);

  const results = mapSome(
    data,
    (
      d
    ): {
      pre: TokenAmount | null | undefined;
      post: TokenAmount | null | undefined;
    } => {
      const accountIndex = d.transaction.message.accountKeys.findIndex((k) =>
        k.pubkey.equals(tokenAccount)
      );
      if (accountIndex === -1) {
        return {
          pre: new TokenAmount(token, 0),
          post: new TokenAmount(token, 0),
        };
      }

      const pre = mapSome(
        mapSome(d.meta, (m) => {
          return mapSome(m.preTokenBalances, (balances) => {
            return (
              balances.find((b) => b.accountIndex === accountIndex)
                ?.uiTokenAmount.amount ?? null
            );
          });
        }),
        (v) => new TokenAmount(token, v)
      );

      const post = mapSome(
        mapSome(d.meta, (m) => {
          return mapSome(m.postTokenBalances, (balances) => {
            return (
              balances.find((b) => b.accountIndex === accountIndex)
                ?.uiTokenAmount.amount ?? null
            );
          });
        }),
        (v) => new TokenAmount(token, v)
      );

      return { pre, post };
    }
  );

  const pre = mapSome(results, (r) => r.pre);
  const post = mapSome(results, (r) => r.post);

  const time = mapSome(data, (d) =>
    mapSome(d.blockTime, (bt) => new Date(bt * 1_000))
  );

  return (
    <tr>
      <td>
        {time ? (
          time.toLocaleString(undefined, {
            timeZoneName: "short",
          })
        ) : (
          <DisplayValue value={time} />
        )}
      </td>
      <td>
        <DisplayValue value={pre} />
      </td>
      <td>
        <DisplayValue value={post} />
      </td>
      <td>
        <TXLink txSig={signature} full />
      </td>
    </tr>
  );
};
