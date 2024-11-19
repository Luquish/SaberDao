import { useToken, useTokenMint } from "@rockooor/sail";
import type { ProgramAccount } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import type { SAVEData } from "@tribecahq/save";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { formatDurationSeconds } from "@/utils/tribeca/format";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import ContentLoader from "@/components/tribeca/common/ContentLoader";
import { TokenAmountDisplay } from "@/components/tribeca/common/TokenAmountDisplay";

interface Props {
  data: ProgramAccount<SAVEData>;
}

const SAVECard: React.FC<Props> = ({ data }: Props) => {
  const { path } = useGovernor();
  const { data: token } = useToken(data.account.mint);
  const { data: mintData } = useTokenMint(data.account.mint);

  const outstandingSupply =
    token && mintData
      ? new TokenAmount(token, mintData.account.supply)
      : undefined;

  return (
    <div className="text-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800">
      <div className="flex flex-grow w-2/3">
        <div className="flex-basis[236px] flex flex-col gap-1">
          <span className="font-medium text-white">
            <Link to={`/tribeca${path}/saves/${data.account.mint.toString()}`}>
              {token?.name ?? "Loading..."}
            </Link>
          </span>
          <div className="text-xs flex gap-1 text-secondary">
            <span>ID:</span>
            <AddressLink address={data.account.mint} showCopy />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <span>Min Lock Duration:</span>
          <span className="text-white font-semibold">
            {formatDurationSeconds(data.account.minLockDuration.toNumber())}
          </span>
        </div>
        <div className="flex gap-2">
          <span>Outstanding Supply:</span>
          <span className="text-white font-semibold">
            {outstandingSupply ? (
              <TokenAmountDisplay amount={outstandingSupply} />
            ) : (
              <ContentLoader className="w-10 h-3" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SAVECard;
