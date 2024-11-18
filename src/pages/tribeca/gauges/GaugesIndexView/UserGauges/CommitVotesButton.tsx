import type { PublicKey } from "@solana/web3.js";
import React from "react";

import { useProvider } from "@/hooks/tribeca/useProvider";
import { Button } from "@/components/tribeca/common/Button";
import { useCommitVotes } from "../../hooks/useCommitVotes";

interface Props {
  owner?: PublicKey;
}

export const CommitVotesButton: React.FC<Props> = (props: Props) => {
  const { providerMut } = useProvider();
  const owner = props.owner ?? providerMut?.wallet?.publicKey;
  const commitVotes = useCommitVotes(owner);
  return (
    <Button variant="muted" onClick={commitVotes}>
      Commit
    </Button>
  );
};
