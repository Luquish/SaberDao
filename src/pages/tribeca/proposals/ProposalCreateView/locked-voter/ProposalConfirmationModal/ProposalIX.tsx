import type { TransactionInstruction } from "@solana/web3.js";
import React from "react";

import { useParsedInstruction } from "@/hooks/tribeca/tx/useParsedInstruction";

interface Props {
  ix: TransactionInstruction;
}

const ProposalIX: React.FC<Props> = ({ ix }: Props) => {
  const parsedIX = useParsedInstruction(ix);
  return (
    <div className="bg-gray bg-opacity-20 border border-warmGray-800 px-4 py-2 rounded text-sm font-semibold">
      {parsedIX.title}
    </div>
  );
};

export default ProposalIX;
