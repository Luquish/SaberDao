import type { InstructionLogEntry, PublicKey } from "@saberhq/solana-contrib";
import { formatLogEntry } from "@saberhq/solana-contrib";

import { styleColor } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { RenderedCPI } from "./RenderedCPI";
import { RenderedProgramError } from "./RenderedProgramError";

export const prefixBuilder = (depth: number) => {
  const prefix = new Array(depth - 1).fill("\u00A0\u00A0").join("");
  return prefix + "> ";
};

interface Props {
  entry: InstructionLogEntry;
  currentProgramId?: PublicKey;
}

export const RenderedLogEntry: React.FC<Props> = ({
  entry,
  currentProgramId,
}: Props) => {
  if (entry.type === "cpi") {
    return <RenderedCPI entry={entry} />;
  }
  if (entry.type === "programError") {
    return (
      <RenderedProgramError entry={entry} currentProgramId={currentProgramId} />
    );
  }
  return (
    <span>
      <span>{prefixBuilder(entry.depth)}</span>
      <span style={{ color: styleColor(entry.type) }}>
        {formatLogEntry(entry)}
      </span>
    </span>
  );
};
