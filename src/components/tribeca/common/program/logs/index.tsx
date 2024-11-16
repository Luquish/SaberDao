import type { InstructionLogs } from "@saberhq/solana-contrib";
import type { Message, ParsedMessage } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { darken } from "polished";
import React, { useMemo } from "react";
import invariant from "tiny-invariant";

import { useProgramMetas } from "../../../../../hooks/tribeca/deploydao/useProgramMeta";
import { programLabel } from "../../../../../utils/tribeca/programs";
import { Badge } from "../../Badge";
import { TableCardBody } from "../../card/TableCardBody";
import { RenderedLogEntry } from "./RenderedLogEntry";

interface Props {
  message: Message | ParsedMessage;
  logs: InstructionLogs[];
}

export const ProgramLogs: React.FC<Props> = ({ message, logs }: Props) => {
  const { instructions, programIDs } = useMemo(() => {
    const instructions = message.instructions.map((ix) => {
      let programId: PublicKey;
      if ("programIdIndex" in ix) {
        const programAccount = message.accountKeys[ix.programIdIndex];
        invariant(programAccount);
        if ("pubkey" in programAccount) {
          programId = programAccount.pubkey;
        } else {
          programId = programAccount;
        }
      } else {
        programId = ix.programId;
      }
      return { programId, ix };
    });
    const programIDs = instructions.map((ix) => ix.programId);
    return { instructions, programIDs };
  }, [message]);

  const ixMetas = useProgramMetas(programIDs.map((pid) => pid.toString()));
  return (
    <div className="overflow-x-auto whitespace-nowrap">
      <TableCardBody>
        {instructions.map(({ programId }, index) => {
          const pidIndex = programIDs.findIndex((pid) => pid.equals(programId));
          const programName =
            ixMetas[pidIndex]?.data?.program.label ??
            programLabel(programId.toBase58()) ??
            "Unknown Program";
          const programLogs: InstructionLogs | undefined = logs[index];

          let badgeColor: string = "#ffffff"; // white
          if (programLogs) {
            badgeColor = programLogs.failed
              ? "#ef4444" // red-500 for accent/error
              : "#3b82f6"; // blue-500 for primary
          }

          const cpiStack: PublicKey[] = [programId];
          return (
            <tr key={index}>
              <td>
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    style={{
                      backgroundColor: darken(0.3, badgeColor),
                      color: badgeColor,
                    }}
                    className="h-auto"
                  >
                    #{index + 1}
                  </Badge>
                  <span className="font-bold text-white">
                    {programName} Instruction
                  </span>
                </div>
                {programLogs && (
                  <div className="flex items-start flex-col font-mono p-2 text-sm">
                    {programLogs.logs.map((log, key) => {
                      if (log.type === "cpi" && log.programAddress) {
                        cpiStack.push(new PublicKey(log.programAddress));
                      } else if (log.type === "success") {
                        cpiStack.pop();
                      }
                      return (
                        <RenderedLogEntry
                          key={key}
                          entry={log}
                          currentProgramId={cpiStack[cpiStack.length - 1]}
                        />
                      );
                    })}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </TableCardBody>
    </div>
  );
};
