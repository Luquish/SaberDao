import {
  findGaugeAddress,
  findGaugeVoteAddress,
  findGaugeVoterAddress,
} from "@quarryprotocol/gauge";
import type { QuarryInfo } from "@rockooor/react-quarry";
import { useToken } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import invariant from "tiny-invariant";
import React from "react";

import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { FORMAT_VOTE_PERCENT } from "@/utils/tribeca/format";
import { useGaugeVoteData } from "@/utils/tribeca/parsers";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { TokenIcon } from "@/components/tribeca/common/TokenIcon";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";

interface Props {
  quarry: QuarryInfo;
}

export const GaugeWeightRow: React.FC<Props> = ({ quarry }: Props) => {
  const { data: stakedToken } = useToken(quarry.quarry.account.tokenMintKey);

  const { escrowKey } = useUserEscrow();
  const gaugemeister = useGaugemeister();

  const { data: gaugeKey } = useQuery({
    queryKey: ["gaugeKey", gaugemeister?.toString(), quarry.key.toString()],
    queryFn: async () => {
      invariant(gaugemeister);
      const [gauge] = await findGaugeAddress(gaugemeister, quarry.key);
      return gauge;
    },
    enabled: !!gaugemeister,
  });

  const { data: gaugeVoterKeys } = useQuery({
    queryKey: ["gaugeVoterKeys", gaugeKey?.toString(), escrowKey?.toString()],
    queryFn: async () => {
      invariant(escrowKey && gaugeKey && gaugemeister);
      const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrowKey);
      const [gaugeVote] = await findGaugeVoteAddress(gaugeVoter, gaugeKey);
      return { gaugeVoter, gaugeVote };
    },
    enabled: !!escrowKey && !!gaugeKey,
  });
  const gaugeVoteKey = gaugeVoterKeys?.gaugeVote;
  const { data: gaugeVote } = useGaugeVoteData(gaugeVoteKey);

  const {
    currentTotalShares,
    nextShares,
    nextTotalShares,
    nextSharesRaw,
    setTokenShareStr,
  } = useUpdateGaugeWeights();
  const nextShare = nextShares[quarry.quarry.account.tokenMintKey.toString()];

  const currentShare = gaugeVote ? gaugeVote.account.weight : null;
  useEffect(() => {
    if (currentShare) {
      setTokenShareStr(
        quarry.quarry.account.tokenMintKey,
        currentShare,
        currentShare.toString()
      );
    }
  }, [
    currentShare,
    quarry.quarry.account.tokenMintKey,
    setTokenShareStr,
    stakedToken,
  ]);

  const percent = nextTotalShares ? (nextShare ?? 0) / nextTotalShares : null;

  const currentSharePercent =
    currentShare !== null && currentTotalShares
      ? currentShare / currentTotalShares
      : null;

  return (
    <tr>
      <td>
        <div className="flex gap-2 items-center">
          <TokenIcon token={stakedToken} />
          {stakedToken?.name ?? <ContentLoader className="h-3 w-10" />}
        </div>
      </td>
      <td>
        {currentSharePercent !== null
          ? FORMAT_VOTE_PERCENT.format(currentSharePercent)
          : "--"}
      </td>
      <td>
        <InputText
          value={
            nextSharesRaw[quarry.quarry.account.tokenMintKey.toString()]
              ?.value ?? ""
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTokenShareStr(
              quarry.quarry.account.tokenMintKey,
              currentShare ?? 0,
              e.target.value
            );
          }}
        />
      </td>
      <td>{percent !== null ? FORMAT_VOTE_PERCENT.format(percent) : "--"}</td>
    </tr>
  );
};
