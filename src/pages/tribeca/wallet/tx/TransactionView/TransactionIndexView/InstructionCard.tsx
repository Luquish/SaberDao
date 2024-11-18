import React from "react";
import { shortenAddress } from "@cardinal/namespaces";

import { useParsedInstruction } from "@/hooks/tribeca/tx/useParsedInstruction";
import type { ParsedInstruction } from "@/hooks/tribeca/useSmartWallet";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { InstructionSummary } from "@/components/tribeca/common/program/InstructionSummary";
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
    <div className="grid border">
      <div className="text-sm p-4">
        <h2 className="font-semibold text-gray-800 mb-2">
          IX #{index + 1}: <InstructionSummary instruction={instruction.ix} />
        </h2>
        <p className="text-xs text-gray-500">
          <span className="font-medium">Program:</span>{" "}
          <AddressLink
            className="font-semibold text-secondary"
            address={instruction.ix.programId}
          >
            {instruction.programName} (
            {shortenAddress(instruction.ix.programId.toString())})
          </AddressLink>
        </p>
      </div>
      <div className="p-4 border-t">
        <InstructionDisplay instruction={instruction} parsed={parsed} />
      </div>
    </div>
  );
};
