import { TokenAmount } from "@saberhq/token-utils";

import { useGovernor } from "./useGovernor";

export const useRealm = () => {
  const { meta, governorData, govToken } = useGovernor();
  const publicKey = meta?.mndeNftLocker?.address;

  const votesForQuorum =
    govToken && governorData
      ? new TokenAmount(govToken, governorData.account.params.quorumVotes)
      : null;

  return {
    govToken,
    publicKey,
    votesForQuorum,
  };
};
