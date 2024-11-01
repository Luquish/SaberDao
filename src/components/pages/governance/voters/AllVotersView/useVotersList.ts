import { fetchNullableWithSessionCache } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";

const buildVotersURL = (governorKey: string) =>
  `https://raw.githubusercontent.com/TribecaHQ/vote-escrow-leaderboard/master/voters/${governorKey}.json`;

export interface VotersList {
  count: number;
  name: string;
  updatedAt: string;
  totalVotes: string;
  voters: {
    amount: TokenAmount;
    escrow: PublicKey;
    escrowEndsAt: Date;
    escrowStartedAt: Date;
    latestPower: TokenAmount;
    owner: PublicKey;
    tokenAccount: PublicKey;
  }[];
}

interface VotersListRaw {
  count: number;
  name: string;
  updatedAt: string;
  totalVotes: string;
  voters: {
    amount: string;
    escrow: string;
    escrowEndsAt: string;
    escrowStartedAt: string;
    latestPower: string;
    owner: string;
    tokenAccount: string;
  }[];
}

export interface GovernorVoters {
  count: number;
  name: string;
  updatedAt: string;
  totalVotes: number;
  voters: {
    amount: string;
    escrow: PublicKey;
    escrowEndsAt: Date;
    escrowStartedAt: Date;
    latestPower: string;
    owner: PublicKey;
    tokenAccount: PublicKey;
  }[];
}

export const useGovernorVoters = (governorKey: PublicKey) => {
  return useQuery<GovernorVoters | null>({
    queryKey: ["governorVoters", governorKey.toString()],
    queryFn: async () => {
      const data = await fetchNullableWithSessionCache<VotersListRaw>(
        buildVotersURL(governorKey.toString())
      );
      if (!data) {
        return null;
      }
      return {
        ...data,
        totalVotes: parseFloat(data.totalVotes),
        voters: data.voters.map((rawVoter) => ({
          ...rawVoter,
          escrow: new PublicKey(rawVoter.escrow),
          owner: new PublicKey(rawVoter.owner),
          tokenAccount: new PublicKey(rawVoter.tokenAccount),
          escrowEndsAt: new Date(rawVoter.escrowEndsAt),
          escrowStartedAt: new Date(rawVoter.escrowStartedAt),
        })),
      };
    },
  });
};

export const useVotersList = () => {
  const { governor, veToken, govToken } = useGovernor();
  return useQuery<VotersList>({
    queryKey: ["votersOfDAO", governor.toString()],
    queryFn: async () => {
      invariant(veToken && govToken);
      const data = (await (
        await fetch(buildVotersURL(governor.toString()))
      ).json()) as VotersListRaw;
      return {
        ...data,
        voters: data.voters.map((rawVoter) => ({
          ...rawVoter,
          amount: TokenAmount.parse(govToken, rawVoter.amount),
          latestPower: TokenAmount.parse(veToken, rawVoter.latestPower),
          escrow: new PublicKey(rawVoter.escrow),
          owner: new PublicKey(rawVoter.owner),
          tokenAccount: new PublicKey(rawVoter.tokenAccount),
          escrowEndsAt: new Date(rawVoter.escrowEndsAt),
          escrowStartedAt: new Date(rawVoter.escrowStartedAt),
        })),
      };
    },
    enabled: !!veToken,
  });
};
