import type { TransactionInstruction } from "@solana/web3.js";

import { useParsedInstruction } from "../../../../../../../hooks/tx/useParsedInstruction";

interface Props {
  ix: TransactionInstruction;
}

export const ProposalIX: React.FC<Props> = ({ ix }: Props) => {
  const parsedIX = useParsedInstruction(ix);
  return (
    <div tw="bg-gray bg-opacity-20 border border-warmGray-800 px-4 py-2 rounded text-sm font-semibold">
      {parsedIX.title}
    </div>
  );
};
