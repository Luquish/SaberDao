import { useAccountData, useToken } from "@rockooor/sail";
import { deserializeMint, TokenAmount } from "@saberhq/token-utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";
import React, { useMemo } from "react";

import { AttributeList } from "../../../../../../common/AttributeList";

interface Props {
  mint: PublicKey;
}

export const MintInfo: React.FC<Props> = ({ mint }: Props) => {
  const wallet = useAnchorWallet();
  const { data, loading } = useAccountData(mint);
  const mintInfo = useMemo(() => {
    if (!data) {
      return null;
    }
    try {
      return deserializeMint(data.accountInfo.data);
    } catch (e) {
      return null;
    }
  }, [data]);
  const { data: token } = useToken(mint);

  if (!loading && !data) {
    const owner = wallet?.publicKey;
    if (!owner) {
      return <p>Please connect your wallet.</p>;
    }
    return <div>Token not found on this network.</div>;
  }

  return (
    <AttributeList
      loading={loading}
      attributes={{
        Address: mint,
        Supply:
          token && mintInfo
            ? new TokenAmount(token, mintInfo.supply)
            : mintInfo?.supply,
        Decimals: mintInfo?.decimals,
        "Mint Authority": mintInfo?.mintAuthority,
        "Freeze Authority": mintInfo?.freezeAuthority,
        "Initialized?": mintInfo?.isInitialized,
      }}
    />
  );
};
