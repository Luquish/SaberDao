import type { MinterData } from "@quarryprotocol/quarry-sdk";
import { QuarrySDK } from "@quarryprotocol/quarry-sdk";
import { useTXHandlers } from "@rockooor/sail";
import type { ProgramAccount, Token } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import type { AccountInfo } from "@solana/web3.js";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../../../contexts/sdk";
import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { AsyncButton } from "../../../../../../common/AsyncButton";
import { Card } from "../../../../../../common/governance/Card";
import { InputTokenAmount } from "../../../../../../common/inputs/InputTokenAmount";

interface Props {
  token: Token;
  minter: ProgramAccount<MinterData>;
}

export const SelfMint: React.FC<Props> = ({ token, minter }: Props) => {
  const [mintAmountRaw, setMintAmountRaw] = useState<string>("");
  const { sdkMut } = useSDK();
  const { wrapTx } = useWrapTx();
  const { signAndConfirmTX } = useTXHandlers();

  const mintAmount = useMemo(() => {
    try {
      return token ? TokenAmount.parse(token, mintAmountRaw) : null;
    } catch (e) {
      return null;
    }
  }, [token, mintAmountRaw]);

  if (
    !sdkMut?.provider.wallet.publicKey.equals(minter.account.minterAuthority)
  ) {
    return (
      <Card title="Self Mint" padded>
        <p>You are not the minter authority.</p>
      </Card>
    );
  }

  return (
    <Card title="Self Mint">
      <InputTokenAmount
        label="Mint Amount"
        tokens={[]}
        token={token}
        inputValue={mintAmountRaw}
        inputOnChange={setMintAmountRaw}
      />
      <AsyncButton
        disabled={!mintAmount}
        onClick={async (sdkMut) => {
          invariant(mintAmount, "mint amount");
          const quarrySDK = QuarrySDK.load({ provider: sdkMut.provider });
          const performMintTX = await quarrySDK.mintWrapper.performMint({
            amount: mintAmount,
            minter: {
              accountId: minter.publicKey,
              accountInfo: {
                data: minter.account,
              } as AccountInfo<MinterData>,
            },
          });

          await signAndConfirmTX(
            await wrapTx(performMintTX),
            `Mint ${mintAmount.formatUnits()} to self`
          );
        }}
      >
        Self Mint
      </AsyncButton>
    </Card>
  );
};
