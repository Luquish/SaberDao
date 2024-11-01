import { usePubkey } from "@rockooor/sail";
import type { InstructionLogEntry } from "@saberhq/solana-contrib";

import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { styleColor } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { prefixBuilder } from ".";

interface Props {
  entry: InstructionLogEntry & { type: "cpi" };
}

export const RenderedCPI: React.FC<Props> = ({ entry }: Props) => {
  const programId = usePubkey(entry.programAddress);
  const label = useProgramLabel(programId);

  return (
    <span>
      <span>{prefixBuilder(entry.depth)}</span>
      <span style={{ color: styleColor(entry.type) }}>Invoking {label}</span>
    </span>
  );
};
