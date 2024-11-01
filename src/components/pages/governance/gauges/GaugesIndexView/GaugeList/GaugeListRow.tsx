import type { GaugeData } from "@quarryprotocol/gauge";
import { findEpochGaugeAddress } from "@quarryprotocol/gauge";
import type { QuarryInfo } from "@rockooor/react-quarry";
import { useRewarder } from "@rockooor/react-quarry";
import { useToken } from "@rockooor/sail";
import type { ProgramAccount } from "@saberhq/token-utils";
import { Fraction, Percent, TokenAmount } from "@saberhq/token-utils";
import { useQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { FaExclamationCircle, FaExternalLinkAlt } from "react-icons/fa";
import invariant from "tiny-invariant";

import { useGovernor } from "../../../../../../hooks/tribeca/useGovernor";
import { useParsedEpochGauge } from "../../../../../../utils/parsers";
import { useEnvironment } from "../../../../../../utils/useEnvironment";
import { ContentLoader } from "../../../../../common/ContentLoader";
import { MouseoverTooltip } from "../../../../../common/MouseoverTooltip";
import { TokenAmountDisplay } from "../../../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../../../common/TokenIcon";
import { useGM } from "../../context";

const MdHorizontalRule = ({ className }: { className?: string }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path fillRule="evenodd" d="M4 11h16v2H4z"></path>
  </svg>
);

const IoTriangle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M464 464H48a16 16 0 01-14.07-23.62l208-384a16 16 0 0128.14 0l208 384A16 16 0 01464 464z"></path>
  </svg>
);

interface Props {
  quarry: QuarryInfo;
  gauge: ProgramAccount<GaugeData>;
  /**
   * If null, the total shares are stil loading.
   */
  totalShares: BN | null;
  dailyRewardsRate: BN | null | undefined;
  /**
   * The current rank of the quarry.
   */
  currentRank: number;
  /**
   * The next rank of the quarry.
   */
  nextRank: number | null;
}

/**
 * Row in the "All Gauges" section of the Gauges homepage.
 * @returns
 */
export const GaugeListRow: React.FC<Props> = ({
  quarry,
  gauge: {
    publicKey: gaugeKey,
    account: { isDisabled },
  },
  totalShares,
  dailyRewardsRate,
  currentRank,
  nextRank,
}: Props) => {
  const { votingEpoch } = useGM();
  const { veToken } = useGovernor();

  const { data: epochGaugeKey } = useQuery({
    queryKey: ["epochGaugeKey", gaugeKey.toString()],
    queryFn: async () => {
      invariant(votingEpoch, "votingEpoch must be defined");
      const [key] = await findEpochGaugeAddress(gaugeKey, votingEpoch);
      return key;
    },
    enabled: votingEpoch !== null,
  });

  const { data: epochGauge } = useParsedEpochGauge(epochGaugeKey);

  const { rewardToken, rewarder, rewarderKey } = useRewarder();
  const rewardsRate = rewardToken
    ? new TokenAmount(
        rewardToken,
        quarry.quarry.account.annualRewardsRate.div(new BN(365))
      )
    : rewardToken;

  const percent = rewarder
    ? new Percent(
        quarry.quarry.account.rewardsShare,
        rewarder.account.totalRewardsShares
      )
    : null;

  const nextPercent =
    epochGauge && totalShares
      ? new Percent(epochGauge.accountInfo.data.totalPower, totalShares)
      : null;
  const nextRewardsRate =
    rewardToken && dailyRewardsRate && epochGauge && totalShares
      ? new TokenAmount(
          rewardToken,
          dailyRewardsRate
            .mul(epochGauge.accountInfo.data.totalPower)
            .div(totalShares)
        )
      : null;

  const { network } = useEnvironment();
  const quarryLink = `https://${
    network === "mainnet-beta"
      ? "app"
      : network === "devnet"
      ? "devnet"
      : network === "testnet"
      ? "testnet"
      : "app"
  }.quarry.so/#/rewarders/${rewarderKey.toString()}/quarries/${quarry.key.toString()}`;

  const delta = nextRank === null ? null : nextRank - currentRank;

  const { data: stakedToken } = useToken(quarry.quarry.account.tokenMintKey);

  return (
    <tr>
      <td>
        {!isDisabled && (
          <div tw="flex items-center gap-2.5 w-full">
            <div tw="w-3 h-3 flex items-center">
              <MouseoverTooltip
                text={
                  <div tw="flex flex-col gap-2">
                    <p>Previous Rank: {currentRank}</p>
                    <p>
                      Next Rank: {nextRank} (
                      {delta === null
                        ? "??"
                        : delta > 0
                        ? `-${delta}`
                        : delta < 0
                        ? `+${-delta}`
                        : "+0"}
                      )
                    </p>
                  </div>
                }
              >
                {delta === null ? (
                  <></>
                ) : delta > 0 ? (
                  <IoTriangle tw="w-3 h-3 rotate-180 text-red-500" />
                ) : delta < 0 ? (
                  <IoTriangle tw="w-3 h-3 text-primary" />
                ) : (
                  <MdHorizontalRule tw="w-3 h-3 text-neutral-600" />
                )}
              </MouseoverTooltip>
            </div>
            <div tw="text-white font-bold">{nextRank}</div>
          </div>
        )}
      </td>
      <td>
        <div tw="flex gap-2 items-center h-10">
          <TokenIcon token={stakedToken} />
          {isDisabled ? (
            <MouseoverTooltip text="Voting for this gauge is currently disabled.">
              <div tw="flex gap-2 items-center">
                <FaExclamationCircle tw="text-red-500 cursor-pointer" />
                <a
                  tw="font-medium line-through text-slate-600"
                  href={quarryLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {stakedToken?.name ?? <ContentLoader tw="h-3 w-10" />}
                </a>
              </div>
            </MouseoverTooltip>
          ) : (
            <a
              tw="font-medium hover:underline"
              href={quarryLink}
              target="_blank"
              rel="noreferrer"
            >
              {stakedToken?.name ?? <ContentLoader tw="h-3 w-10" />}
            </a>
          )}
          {stakedToken?.info.extensions?.website ? (
            <a
              tw="text-primary hover:text-white transition-colors"
              href={stakedToken.info.extensions.website}
              target="_blank"
              rel="noreferrer"
            >
              <FaExternalLinkAlt />
            </a>
          ) : null}
        </div>
      </td>
      <td>
        <div tw="flex flex-col gap-1">
          <span tw="text-white font-medium">
            {percent?.toFixed(2)}%{" "}
            <span tw="text-warmGray-400 font-normal">
              (
              {(votingEpoch && votingEpoch > 1 && veToken
                ? new TokenAmount(
                    veToken,
                    quarry.quarry.account.rewardsShare
                  ).toFixed(0, { groupSeparator: "," })
                : new Fraction(quarry.quarry.account.rewardsShare).toFixed(0, {
                    groupSeparator: ",",
                  })
              ).toLocaleString()}
              )
            </span>
          </span>
          <span tw="text-xs">
            {rewardsRate && (
              <TokenAmountDisplay amount={rewardsRate} suffix="/day" />
            )}
          </span>
        </div>
      </td>
      <td>
        <div tw="flex flex-col gap-1">
          <span tw="text-white font-medium">
            {nextPercent?.toFixed(2)}%{" "}
            <span tw="text-warmGray-400 font-normal">
              (
              {epochGauge && veToken
                ? new TokenAmount(
                    veToken,
                    epochGauge.accountInfo.data.totalPower
                  ).toExact({
                    groupSeparator: ",",
                  })
                : "--"}
              )
            </span>
          </span>
          <span tw="text-xs">
            {nextRewardsRate && (
              <TokenAmountDisplay amount={nextRewardsRate} suffix="/day" />
            )}
          </span>
        </div>
      </td>
    </tr>
  );
};
