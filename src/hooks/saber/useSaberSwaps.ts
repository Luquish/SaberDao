import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { formatNetwork } from "@saberhq/solana-contrib";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

import { useEnvironment } from "../../utils/useEnvironment";

export interface SaberSwap {
  addresses: SaberSwapAddresses;
  currency: string;
  decimals: number;
  displayTokens: readonly [PublicKey, PublicKey];
  id: string;
  isVerified: boolean;
  name: string;
  sources: readonly string[];
  tags: readonly string[];
  underlyingTokens: readonly [PublicKey, PublicKey];
}

export interface SaberSwapAddresses {
  admin: PublicKey;
  lpTokenMint: PublicKey;
  mergePool: PublicKey;
  quarry: PublicKey;
  reserves: readonly [PublicKey, PublicKey];
  swapAccount: PublicKey;
  swapAuthority: PublicKey;
}

interface SaberSwapRaw {
  addresses: SaberSwapAddressesRaw;
  currency: string;
  decimals: number;
  displayTokens: string[];
  id: string;
  isVerified: boolean;
  name: string;
  sources: string[];
  tags: string[];
  underlyingTokens: string[];
}

interface SaberSwapAddressesRaw {
  admin: string;
  lpTokenMint: string;
  mergePool: string;
  quarry: string;
  reserves: readonly string[];
  swapAccount: string;
  swapAuthority: string;
}

const parseRawSwap = ({
  addresses: {
    admin,
    lpTokenMint,
    mergePool,
    quarry,
    reserves,
    swapAccount,
    swapAuthority,
  },
  displayTokens,
  underlyingTokens,
  ...rest
}: SaberSwapRaw): SaberSwap => {
  return {
    ...rest,
    addresses: {
      admin: new PublicKey(admin),
      lpTokenMint: new PublicKey(lpTokenMint),
      mergePool: new PublicKey(mergePool),
      quarry: new PublicKey(quarry),
      reserves: reserves.map((r) => new PublicKey(r)) as [PublicKey, PublicKey],
      swapAccount: new PublicKey(swapAccount),
      swapAuthority: new PublicKey(swapAuthority),
    },
    displayTokens: displayTokens.map((d) => new PublicKey(d)) as [
      PublicKey,
      PublicKey
    ],
    underlyingTokens: underlyingTokens.map((d) => new PublicKey(d)) as [
      PublicKey,
      PublicKey
    ],
  };
};

export const useSaberSwaps = () => {
  const { network } = useEnvironment();
  return useQuery({
    queryKey: ["saberSwaps", network],
    queryFn: async () => {
      const result = await fetchNullableWithSessionCache<
        readonly SaberSwapRaw[]
      >(
        `https://cdn.jsdelivr.net/gh/saber-hq/saber-registry-dist@master/data/swaps.${formatNetwork(
          network
        )}.json`
      );
      if (!result) {
        return null;
      }
      return result.map(parseRawSwap);
    },
  });
};
