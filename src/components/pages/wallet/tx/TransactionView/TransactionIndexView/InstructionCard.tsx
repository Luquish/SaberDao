import { shortenAddress } from "@cardinal/namespaces";

import { useParsedInstruction } from "../../../../../../hooks/tx/useParsedInstruction";
import type { ParsedInstruction } from "../../../../../../hooks/useSmartWallet";
import { AddressLink } from "../../../../../common/AddressLink";
import { InstructionSummary } from "../../../../../common/program/InstructionSummary";
import { InstructionDisplay } from "./InstructionDisplay";

interface Props {
  index: number;
  instruction: ParsedInstruction;
}

export const InstructionCard: React.FC<Props> = ({
  instruction,
  index,
}: Props) => {
  const parsed = useParsedInstruction(instruction.ix);
  return (
    <div tw="grid border">
      <div tw="text-sm p-4">
        <h2 tw="font-semibold text-gray-800 mb-2">
          IX #{index + 1}: <InstructionSummary instruction={instruction.ix} />
        </h2>
        <p tw="text-xs text-gray-500">
          <span tw="font-medium">Program:</span>{" "}
          <AddressLink
            tw="font-semibold text-secondary"
            address={instruction.ix.programId}
          >
            {instruction.programName} (
            {shortenAddress(instruction.ix.programId.toString())})
          </AddressLink>
        </p>
      </div>
      <div tw="p-4 border-t">
        <InstructionDisplay instruction={instruction} parsed={parsed} />
      </div>
    </div>
  );
};
