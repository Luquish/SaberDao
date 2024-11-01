import { useToken, useTokenMint } from "@rockooor/sail";
import type { ProgramAccount } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import type { SAVEData } from "@tribecahq/save";
import { Link } from "react-router-dom";

import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "../../../../../utils/format";
import { AddressLink } from "../../../../common/AddressLink";
import { ContentLoader } from "../../../../common/ContentLoader";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";

interface Props {
  data: ProgramAccount<SAVEData>;
}

export const SAVECard: React.FC<Props> = ({ data }: Props) => {
  const { path } = useGovernor();
  const { data: token } = useToken(data.account.mint);
  const { data: mintData } = useTokenMint(data.account.mint);

  const outstandingSupply =
    token && mintData
      ? new TokenAmount(token, mintData.account.supply)
      : undefined;

  return (
    <div tw="text-sm flex flex-col gap-4 md:(flex-row items-center justify-between) py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800">
      <div tw="flex flex-grow w-2/3">
        <div tw="flex-basis[236px] flex flex-col gap-1">
          <span tw="font-medium text-white">
            <Link to={`${path}/saves/${data.account.mint.toString()}`}>
              {token?.name ?? "Loading..."}
            </Link>
          </span>
          <div tw="text-xs flex gap-1 text-secondary">
            <span>ID:</span>
            <AddressLink address={data.account.mint} showCopy />
          </div>
        </div>
      </div>
      <div tw="flex flex-col gap-1">
        <div tw="flex gap-2">
          <span>Min Lock Duration:</span>
          <span tw="text-white font-semibold">
            {formatDurationSeconds(data.account.minLockDuration.toNumber())}
          </span>
        </div>
        <div tw="flex gap-2">
          <span>Outstanding Supply:</span>
          <span tw="text-white font-semibold">
            {outstandingSupply ? (
              <TokenAmountDisplay amount={outstandingSupply} />
            ) : (
              <ContentLoader tw="w-10 h-3" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
