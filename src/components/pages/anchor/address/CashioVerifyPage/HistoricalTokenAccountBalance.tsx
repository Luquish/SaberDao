import { mapSome } from "@saberhq/solana-contrib";
import { ChainId, Token } from "@saberhq/token-utils";
import type { PublicKey } from "@solana/web3.js";
import tw from "twin.macro";

import {
  DATE_FORMATTER,
  formatSignificantDistanceWithSuffix,
} from "../../../../../utils/format";
import { NamedAddressLink } from "../../../../common/account/NamedAddressLink";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { TXLink } from "../../../../common/TXLink";
import {
  SLOT_OF_HACK,
  TIME_OF_HACK,
  useBalanceAtTimeOfHack,
} from "./useBalanceAtTimeOfHack";
import type { CashioHackedAccountType } from "./useCashioHackUBOInfo";

interface Props {
  account: PublicKey;
  type: CashioHackedAccountType;
  owner: PublicKey;
}

const TULIP_CASH_USDC_LP: Token = new Token({
  address: "8Hk1ViCBcQ5bcKzeXNhLtnxuSUyfwGq6n9UYm64kznDL",
  logoURI:
    "https://raw.githubusercontent.com/saber-hq/saber-lp-token-list/master/assets/mainnet/CLPKiHjoU5HwpPK5L6MBXHKqFsuzPr47dM1w4An3Lnvv/icon.png",
  chainId: ChainId.MainnetBeta,
  name: "Tulip CASH-USDC LP",
  symbol: "tulipCASH-USDC-LP",
  decimals: 6,
});

export const HistoricalTokenAccountBalance: React.FC<Props> = ({
  account,
  type,
}: Props) => {
  const { preTX, preHackBalance, preTXSig } = useBalanceAtTimeOfHack(account);
  return (
    <tr>
      <td>
        <div tw="flex flex-col gap-1">
          <NamedAddressLink address={account} shorten={false} showCopy />
          <span>{type}</span>
        </div>
      </td>
      <td>
        {mapSome(preHackBalance, (bal) => (
          <TokenAmountDisplay
            token={
              bal.token.address === TULIP_CASH_USDC_LP.address
                ? TULIP_CASH_USDC_LP
                : undefined
            }
            amount={bal}
            showIcon
            css={[
              bal.isNonZero() && tw`text-white`,
              bal.greaterThan("1") && tw`font-semibold`,
            ]}
          />
        ))}
        {preHackBalance === undefined && <LoadingSpinner />}
        {preHackBalance === null && <span>0</span>}
      </td>
      <td>
        {mapSome(preTX, (t) =>
          mapSome(t.blockTime, (blockTime) => {
            const txTime = new Date(blockTime * 1_000);
            return (
              <div tw="flex flex-col gap-1">
                <span tw="text-white">{DATE_FORMATTER.format(txTime)}</span>
                <span tw="text-xs">
                  {formatSignificantDistanceWithSuffix(TIME_OF_HACK, txTime)}{" "}
                  the hack
                </span>
              </div>
            );
          })
        )}
        {preTX === undefined && <LoadingSpinner />}
        {preTX === null && <span>N/A</span>}
      </td>
      <td>
        {mapSome(preTXSig, (sig) => (
          <TXLink txSig={sig} full />
        ))}
        {preTXSig === undefined && <LoadingSpinner />}
        {preTXSig === null && (
          <span tw="text-red-500">
            No transactions were found before the time of the hack (
            {DATE_FORMATTER.format(TIME_OF_HACK)}, slot{" "}
            {SLOT_OF_HACK.toLocaleString()}).
          </span>
        )}
      </td>
    </tr>
  );
};
