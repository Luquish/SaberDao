import { useToken, useTokenMint } from "@rockooor/sail";
import type { ProgramAccount } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import type { SAVEData } from "@tribecahq/save";

import { formatDurationSeconds } from "../../../../../utils/format";
import { AttributeList } from "../../../../common/AttributeList";

interface Props {
  saveData: ProgramAccount<SAVEData>;
}

export const SAVEDetails: React.FC<Props> = ({ saveData }: Props) => {
  const { data: token } = useToken(saveData.account.mint);
  const { data: underlyingToken } = useToken(saveData.account.underlyingMint);
  const { data: yiToken } = useToken(saveData.account.yiMint);

  const { data: tokenMint } = useTokenMint(saveData.account.mint);

  return (
    <AttributeList
      attributes={{
        token: token,
        outstandingSupply:
          tokenMint && token
            ? new TokenAmount(token, tokenMint.account.supply)
            : null,
        bump: saveData.account.bump,
        minLockDuration: formatDurationSeconds(
          saveData.account.minLockDuration.toNumber()
        ),
        "Min Lock Duration (seconds)":
          saveData.account.minLockDuration.toNumber(),
        "Underlying Token": underlyingToken,
        "Yi Token": yiToken,
        yi: saveData.account.yi,
        yiTokens: saveData.account.yiTokens,
        locker: saveData.account.locker,
      }}
    />
  );
};
