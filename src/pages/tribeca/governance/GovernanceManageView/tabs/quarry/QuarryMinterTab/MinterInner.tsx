import { findMinterAddress, QuarrySDK } from "@quarryprotocol/quarry-sdk";
import { useMinterData, useRewarder } from "@rockooor/react-quarry";
import {
  noneProduct,
  usePubkey,
  useToken,
  useTXHandlers,
} from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import { TokenAmount } from "@saberhq/token-utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation } from "@reach/router";
import invariant from "tiny-invariant";
import React from "react";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { Card } from "@/components/tribeca/common/governance/Card";
import { InputTokenAmount } from "@/components/tribeca/common/inputs/InputTokenAmount";
import { LoadingSpinner } from "@/components/tribeca/common/LoadingSpinner";
import { SelfMint } from "./SelfMint";

// Función auxiliar para obtener parámetros de la URL
function getParams(pathname: string) {
  const paths = pathname.split('/');
  const minterAuthorityKey = paths[paths.indexOf('minters') + 1] || '';
  return { minterAuthorityKey };
}

export const MinterInner: React.FC = () => {
  const { signAndConfirmTX } = useTXHandlers();
  const { meta } = useGovernor();
  const { wrapTx } = useWrapTx();
  const { mintWrapper: mintWrapperData } = useRewarder();
  const location = useLocation();
  const { minterAuthorityKey: minterAuthorityKeyStr } = getParams(location.pathname);
  const mintWrapper = meta?.quarry?.mintWrapper;
  const minterAuthority = usePubkey(minterAuthorityKeyStr);

  const { data: minterKey } = useQuery({
    queryKey: [
      "quarryMinterKey",
      mintWrapper?.toString(),
      minterAuthority?.toString(),
    ],
    queryFn: async () => {
      if (!mintWrapper || !minterAuthority) {
        return noneProduct(mintWrapper, minterAuthority);
      }
      const [minterKey] = await findMinterAddress(mintWrapper, minterAuthority);
      return minterKey;
    },
  });
  const { data: minterData } = useMinterData(minterKey);

  const [allowance, setAllowance] = useState<string>("");
  const { data: token } = useToken(
    mapSome(mintWrapperData, (x) => x.account.tokenMint)
  );

  const allowanceAmt = useMemo(() => {
    try {
      return mapSome(token, (t) => TokenAmount.parse(t, allowance));
    } catch (e) {
      return null;
    }
  }, [token, allowance]);

  if (!mintWrapperData) {
    return (
      <Card title="Minter" padded>
        Mint Wrapper does not exist.
      </Card>
    );
  }

  if (!minterData) {
    return (
      <Card title="Minter" padded>
        <LoadingSpinner />
      </Card>
    );
  }

  if (!token) {
    return <Card title="Minter">Token not found.</Card>;
  }

  if (!minterAuthority) {
    return <Card title="Minter">Minter authority not found.</Card>;
  }

  if (!minterData) {
    return (
      <Card title="Minter">
        <p>The minter at {minterKey?.toString()} does not exist.</p>
        <InputTokenAmount
          label="Allowance"
          tokens={[]}
          token={token}
          inputValue={allowance}
          inputOnChange={setAllowance}
        />
        <AsyncButton
          disabled={!allowanceAmt || !minterAuthority}
          onClick={async (sdkMut) => {
            invariant(allowanceAmt, "allowance amt");
            invariant(minterAuthority, "minter authority");
            const quarrySDK = QuarrySDK.load({ provider: sdkMut.provider });

            const tx = await quarrySDK.mintWrapper.newMinterWithAllowance(
              mintWrapperData.publicKey,
              minterAuthority,
              allowanceAmt.toU64()
            );
            await signAndConfirmTX(await wrapTx(tx), "Create minter");
          }}
        >
          Initialize Minter
        </AsyncButton>
      </Card>
    );
  }

  return (
    <div>
      <Card title="Minter Info">
        <AttributeList
          attributes={{
            Key: minterData.publicKey,
            Bump: minterData.account.bump,
            Allowance: new TokenAmount(token, minterData.account.allowance),
            "Mint Wrapper": minterData.account.mintWrapper,
            "Minter Authority": minterData.account.minterAuthority,
          }}
        />
      </Card>
      <Card title="Set Allowance">
        <InputTokenAmount
          label="Allowance"
          tokens={[]}
          token={token}
          inputValue={allowance}
          inputOnChange={setAllowance}
        />
        <AsyncButton
          disabled={!allowanceAmt}
          onClick={async (sdkMut) => {
            const quarrySDK = QuarrySDK.load({ provider: sdkMut.provider });
            invariant(allowanceAmt, "allowance amt");
            const tx = await quarrySDK.mintWrapper.minterUpdate(
              mintWrapperData.publicKey,
              minterAuthority,
              allowanceAmt.toU64()
            );
            await signAndConfirmTX(
              await wrapTx(tx),
              `Set allowance to ${allowanceAmt.formatUnits()}`
            );
          }}
        >
          Set Allowance
        </AsyncButton>
      </Card>
      <SelfMint token={token} minter={minterData} />
    </div>
  );
};
