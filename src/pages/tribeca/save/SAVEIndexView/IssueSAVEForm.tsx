import {
  useToken,
  useTokenAmount,
  useTXHandlers,
  useUserATAs,
} from "@rockooor/sail";
import type { ProgramAccount } from "@saberhq/token-utils";
import type { SAVEData } from "@tribecahq/save";
import { SAVEWrapper } from "@tribecahq/save";
import { useState } from "react";
import invariant from "tiny-invariant";
import React from "react";

import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { InputTokenAmount } from "@/components/tribeca/common/inputs/InputTokenAmount";

interface Props {
  saveData: ProgramAccount<SAVEData>;
}

export const IssueSAVEForm: React.FC<Props> = ({ saveData }: Props) => {
  const { data: underlyingToken } = useToken(saveData.account.underlyingMint);
  const [amountStr, setAmountStr] = useState<string>("");
  const tokenAmount = useTokenAmount(underlyingToken, amountStr);
  const [userBalance] = useUserATAs(underlyingToken);
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();

  const disabledReason =
    !tokenAmount || tokenAmount.isZero()
      ? "Enter a token amount"
      : userBalance && tokenAmount.greaterThan(userBalance.balance)
      ? "Insufficient balance"
      : null;

  return (
    <div className="flex flex-col gap-4">
      <InputTokenAmount
        label="Tokens to Issue"
        tokens={[]}
        token={underlyingToken ?? null}
        inputValue={amountStr}
        inputOnChange={setAmountStr}
        currentAmount={{
          amount: userBalance?.balance,
          allowSelect: true,
        }}
      />
      <AsyncButton
        variant="primary"
        disabled={!!disabledReason}
        onClick={async (sdkMut) => {
          invariant(tokenAmount);
          const saveSDK = new SAVEWrapper(sdkMut.provider);
          const tx = await saveSDK.mintFromUnderlying({
            amount: tokenAmount.toU64(),
            saveData: saveData.account,
          });
          await signAndConfirmTX(await wrapTx(tx), "Issue SAVE");
        }}
      >
        {disabledReason ?? "Issue SAVEs"}
      </AsyncButton>
    </div>
  );
};
