import { findEpochGaugeVoteAddress } from "@quarryprotocol/gauge";
import { useQuarryData } from "@rockooor/react-quarry";
import { useToken } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import React from 'react';

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { FORMAT_VOTE_PERCENT } from "@/utils/tribeca/format";
import {
  useGaugeData,
  useParsedEpochGaugeVote,
} from "@/utils/tribeca/parsers";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { Meter } from "@/components/tribeca/common/Meter";
import { TokenIcon } from "@/components/tribeca/common/TokenIcon";
import { useGMData } from "../../hooks/useGaugemeister";
import type { UserGaugeInfo } from "../../hooks/useMyGauges";
import { CommitVotesButton } from "./CommitVotesButton";

interface Props {
  className?: string;
  owner?: PublicKey;
  gaugeVote: UserGaugeInfo;
}

export const UserGauge: React.FC<Props> = ({
  className,
  gaugeVote,
  owner,
}: Props) => {
  const { data: gm } = useGMData();
  const { data: gauge } = useGaugeData(gaugeVote.key);
  const { data: quarry } = useQuarryData(gauge?.account.quarry);
  const { veToken } = useGovernor();
  const { data: stakedToken } = useToken(quarry?.account.tokenMintKey);
  const { data: epochGaugeVoteKey } = useQuery({
    queryKey: [
      "epochGaugeVoteKey",
      gaugeVote.key.toString(),
      gm?.publicKey.toString(),
    ],
    queryFn: async () => {
      invariant(gm);
      const [key] = await findEpochGaugeVoteAddress(
        gaugeVote.key,
        gm.account.currentRewardsEpoch + 1
      );
      return key;
    },
    enabled: !!gm,
  });
  const { data: epochGaugeVote } = useParsedEpochGaugeVote(epochGaugeVoteKey);

  return (
    <tr className={className}>
      <td>
        <div className="flex items-center gap-2">
          <TokenIcon token={stakedToken} />
          <div>
            {stakedToken ? (
              <span>{stakedToken?.name}</span>
            ) : (
              <ContentLoader className="w-32 h-4" />
            )}
          </div>
        </div>
      </td>
      <td>
        {epochGaugeVote && veToken ? (
          new TokenAmount(
            veToken,
            epochGaugeVote.accountInfo.data.allocatedPower
          ).formatUnits()
        ) : epochGaugeVote === undefined ? (
          <ContentLoader className="w-20 h-4" />
        ) : (
          <CommitVotesButton owner={owner} />
        )}
      </td>
      <td>
        <div className="flex items-center">
          <div className="w-16">
            <Meter
              value={gaugeVote.percent ?? 0}
              max={1}
              barColor="var(--color-primary)"
            />
          </div>
          <div className="ml-2">
            {gaugeVote.percent !== null
              ? FORMAT_VOTE_PERCENT.format(gaugeVote.percent)
              : "--"}
          </div>
        </div>
      </td>
    </tr>
  );
};
