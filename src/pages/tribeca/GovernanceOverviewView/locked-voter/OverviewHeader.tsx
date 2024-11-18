import { useTokenAmount, useTokenMint } from "@rockooor/sail";
import { mapN } from "@saberhq/solana-contrib";
import { TokenAmount } from "@saberhq/token-utils";
import React from 'react';

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useVotersList } from "../../voters/AllVotersView/useVotersList";

export const OverviewHeader: React.FC = () => {
  const { govToken, veToken, lockedSupply } = useGovernor();

  const { data: votersList } = useVotersList();
  const { data: govTokenData } = useTokenMint(govToken?.mintAccount);
  const totalSupplyFmt = mapN(
    (govTokenData, govToken) =>
      new TokenAmount(govToken, govTokenData.account.supply).format({
        numberFormatOptions: {
          maximumFractionDigits: 0,
        },
      }),
    govTokenData,
    govToken
  );
  const lockedSupplyFmt = lockedSupply
    ? lockedSupply.format({
        numberFormatOptions: {
          maximumFractionDigits: 0,
        },
      })
    : lockedSupply;

  const totalVeTokens = useTokenAmount(veToken, votersList?.totalVotes ?? "0");

  return (
    <div className="flex flex-wrap gap-2.5">
      <div className="flex-grow basis-full md:basis-auto bg-coolGray-800 p-5 rounded">
        <div className="flex flex-col">
          <div className="h-7 flex items-center">
            {lockedSupplyFmt ? (
              <span className="text-white text-xl font-semibold">
                {lockedSupplyFmt}
              </span>
            ) : (
              <div className="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span className="text-xs font-semibold text-coolGray-300 tracking-tighter">
            {govToken?.symbol} Locked
          </span>
        </div>
      </div>
      <div className="flex-grow md:(basis-[200px] flex-grow-0) bg-coolGray-800 p-5 rounded">
        <div className="flex flex-col">
          <div className="h-7 flex items-center">
            {totalVeTokens ? (
              <span className="text-white text-xl font-semibold">
                {totalVeTokens.asNumber.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            ) : (
              <div className="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span className="text-xs font-semibold text-coolGray-300 tracking-tighter">
            Total Supply of {veToken?.symbol}
          </span>
        </div>
      </div>
      <div className="flex-grow md:(basis-[200px] flex-grow-0) bg-coolGray-800 p-5 rounded">
        <div className="flex flex-col">
          <div className="h-7 flex items-center">
            {totalSupplyFmt ? (
              <span className="text-white text-xl font-semibold">
                {totalSupplyFmt}
              </span>
            ) : (
              <div className="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span className="text-xs font-semibold text-coolGray-300 tracking-tighter">
            Total Supply of {govToken?.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};
