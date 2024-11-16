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

import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import { FORMAT_VOTE_PERCENT } from "../../../../../utils/format";
import { useGaugeVoteData } from "../../../../../utils/parsers";
import { ContentLoader } from "../../../../common/ContentLoader";
import { InputText } from "../../../../common/inputs/InputText";
import { TokenIcon } from "../../../../common/TokenIcon";
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
        <div tw="flex gap-2 items-center">
          <TokenIcon token={stakedToken} />
          {stakedToken?.name ?? <ContentLoader tw="h-3 w-10" />}
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
          onChange={(e) => {
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
