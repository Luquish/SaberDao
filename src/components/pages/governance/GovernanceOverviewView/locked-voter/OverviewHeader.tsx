import { useTokenAmount, useTokenMint } from "@rockooor/sail";
import { mapN } from "@saberhq/solana-contrib";
import { TokenAmount } from "@saberhq/token-utils";
import tw, { styled } from "twin.macro";

import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
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
    <div tw="flex flex-wrap gap-2.5">
      <StatCard tw="flex-grow flex-basis[100%] md:flex-basis[auto]">
        <StatInner>
          <div tw="h-7 flex items-center">
            {lockedSupplyFmt ? (
              <span tw="text-white text-xl font-semibold">
                {lockedSupplyFmt}
              </span>
            ) : (
              <div tw="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            {govToken?.symbol} Locked
          </span>
        </StatInner>
      </StatCard>
      <StatCard tw="flex-grow md:(flex-basis[200px] flex-grow-0)">
        <StatInner>
          <div tw="h-7 flex items-center">
            {totalVeTokens ? (
              <span tw="text-white text-xl font-semibold">
                {totalVeTokens.asNumber.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            ) : (
              <div tw="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            Total Supply of {veToken?.symbol}
          </span>
        </StatInner>
      </StatCard>
      <StatCard tw="flex-grow md:(flex-basis[200px] flex-grow-0)">
        <StatInner>
          <div tw="h-7 flex items-center">
            {totalSupplyFmt ? (
              <span tw="text-white text-xl font-semibold">
                {totalSupplyFmt}
              </span>
            ) : (
              <div tw="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            Total Supply of {govToken?.symbol}
          </span>
        </StatInner>
      </StatCard>
    </div>
  );
};

const StatCard = styled.div`
  ${tw`bg-coolGray-800 p-5 rounded`}
`;

const StatInner = styled.div`
  ${tw`flex flex-col`}
`;
