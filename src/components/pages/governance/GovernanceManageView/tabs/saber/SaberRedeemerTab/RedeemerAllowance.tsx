import { associated } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { useSail, useToken } from "@rockooor/sail";
import { Saber, SABER_ADDRESSES, SBR_ADDRESS } from "@saberhq/saber-periphery";
import { TokenAmount, u64 } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import invariant from "tiny-invariant";
import { css } from "twin.macro";

import { useExecutiveCouncil } from "../../../../../../../hooks/tribeca/useExecutiveCouncil";
import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { useSaberMinterInfoData } from "../../../../../../../utils/parsers";
import { AsyncButton } from "../../../../../../common/AsyncButton";
import { AttributeList } from "../../../../../../common/AttributeList";
import { Card } from "../../../../../../common/governance/Card";

const AIRDROP_REDEEMER = new PublicKey(
  "3pgqyLSjFXoEw8tMJMXqGmVzFnvx9gMxQEPtNotCFXPn"
);

const INITIAL_ALLOWANCE = new u64("1000000000000000");

interface Props {
  redeemer: PublicKey;
}

export const RedeemerAllowance: React.FC<Props> = ({ redeemer }: Props) => {
  const { ownerInvokeTX, ownerInvokerKey } = useExecutiveCouncil();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const { data: token } = useToken(SBR_ADDRESS);

  const { data: minterInfoKey } = useQuery({
    queryKey: ["minterInfo", redeemer.toString()],
    queryFn: async () => {
      const minterInfo = await associated(
        SABER_ADDRESSES.MintProxy,
        redeemer.toBuffer()
      );
      return minterInfo;
    },
  });
  const { data: minterInfo } = useSaberMinterInfoData(minterInfoKey);

  const initialAllowance = redeemer.equals(AIRDROP_REDEEMER)
    ? new u64("19623303047530")
    : INITIAL_ALLOWANCE;
  const initialAmount = token ? new TokenAmount(token, initialAllowance) : null;

  return (
    <Card title="Increase Allowance">
      <AttributeList
        attributes={{
          Minter: redeemer,
          "Minter Info": minterInfoKey,
          "Initial Amount": initialAmount,
          "Allowance Remaining":
            token && minterInfo
              ? new TokenAmount(token, minterInfo.account.allowance)
              : null,
        }}
      />
      {minterInfo ? (
        <AsyncButton
          css={css`
            margin-top: 24px;
          `}
          disabled={!token || !initialAmount || !ownerInvokerKey}
          onClick={async (sdkMut) => {
            invariant(ownerInvokerKey);
            invariant(token && initialAmount, "token");
            const saberSDK = Saber.load({ provider: sdkMut.provider });
            const minterInfo =
              await saberSDK.mintProxy.program.account.minterInfo.associatedAddress(
                redeemer
              );
            const minterUpdateTX =
              saberSDK.mintProxy.program.state.instruction.minterUpdate(
                initialAmount.toU64(),
                {
                  accounts: {
                    auth: { owner: ownerInvokerKey },
                    minterInfo,
                  },
                }
              );
            await ownerInvokeTX(
              sdkMut.provider.newTX([minterUpdateTX]),
              `Update minter`
            );
          }}
        >
          {`Set Allowance to ${initialAmount?.formatUnits() ?? "--"}`}
        </AsyncButton>
      ) : (
        <AsyncButton
          css={css`
            margin-top: 24px;
          `}
          onClick={async (sdkMut) => {
            invariant(initialAmount, "initial amount");
            const saber = Saber.load({ provider: sdkMut.provider });
            const minterAddTX = await saber.mintProxy.minterAdd(
              redeemer,
              initialAmount.toU64()
            );
            await handleTX(await wrapTx(minterAddTX), `Add Minter`);
          }}
        >
          Create Minter
        </AsyncButton>
      )}
    </Card>
  );
};
