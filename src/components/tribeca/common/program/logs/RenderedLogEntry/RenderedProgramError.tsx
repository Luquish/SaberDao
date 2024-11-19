import { ProgramError } from "@project-serum/anchor";
import type { InstructionLogEntry, PublicKey } from "@saberhq/solana-contrib";
import { useMemo } from "react";

import { useIDL } from "@/hooks/tribeca/useIDLs";
import { styleColor } from "@/components/tribeca/common/program/logs/programLogsV2";
import { prefixBuilder } from ".";
import React from "react";

interface Props {
  entry: InstructionLogEntry & { type: "programError" };
  currentProgramId?: PublicKey;
}

export const RenderedProgramError: React.FC<Props> = ({
  entry,
  currentProgramId,
}: Props) => {
  const { data: idl } = useIDL(currentProgramId);

  const errorParsed = useMemo(() => {
    try {
      const errorMap = new Map<number, string>();
      idl?.idl?.errors?.forEach((err: { code: number; name: string; msg?: string }) => {
        errorMap.set(err.code, `${err.name}${err.msg ? `: ${err.msg}` : ""}`);
      });

      return ProgramError.parse(entry.text, errorMap);
    } catch (e) {
      return null;
    }
  }, [entry, idl]);

  return (
    <span>
      <span>{prefixBuilder(entry.depth)}</span>
      <span style={{ color: styleColor(entry.type) }}>
        Program returned error: {entry.text}
        {errorParsed && (
          <span className="text-slate-400"> # {errorParsed.message}</span>
        )}
      </span>
    </span>
  );
};
