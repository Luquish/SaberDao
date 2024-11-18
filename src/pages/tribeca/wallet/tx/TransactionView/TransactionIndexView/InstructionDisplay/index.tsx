import type { RichParsedInstruction } from "@/hooks/tribeca/tx/useParsedInstruction";
import type { ParsedInstruction } from "@/hooks/tribeca/useSmartWallet";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { Box } from "./Box";
import { IXAccounts } from "./IXAccounts";
import { IXArguments } from "./IXArguments";
import { IXData } from "./IXData";
import React from "react";

interface Props {
  instruction: ParsedInstruction;
  parsed: RichParsedInstruction;
}

export const InstructionDisplay: React.FC<Props> = ({
  instruction,
  parsed,
}: Props) => {
  return (
    <div className="grid gap-4">
      {parsed.data.type === "raw" && (
        <IXData
          data={Buffer.from(parsed.data.data)}
          error={
            instruction.parsed && "error" in instruction.parsed
              ? instruction.parsed.error
              : null
          }
        />
      )}
      {parsed.data.type === "anchor" && <IXArguments args={parsed.data.args} />}
      {parsed.data.type === "object" && (
        <Box title="Arguments" className="p-0">
          <AttributeList
            attributes={parsed.data.args as Record<string, unknown>}
          />
        </Box>
      )}
      <IXAccounts accounts={parsed.accounts} />
    </div>
  );
};
