import React from "react";
import type { ProgramInfo } from "@/hooks/tribeca/useAuthorityPrograms";
import { useProgramLabel } from "@/hooks/tribeca/useProgramMeta";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { SlotLink } from "@/components/tribeca/common/SlotLink";

interface Props {
  program: ProgramInfo;
  actions?: React.ReactNode;
}

export const ProgramCard: React.FC<Props> = ({ program, actions }: Props) => {
  const label = useProgramLabel(program.programID);
  return (
    <div className="flex items-center rounded bg-gray-50 border px-3 py-2 text-sm">
      <div className="flex flex-grow">
        <div className="flex-basis[236px] flex flex-col gap-1">
          <span className="font-medium text-gray-800">{label}</span>
          <div className="text-xs flex gap-1 text-secondary">
            <span>ID:</span>
            <AddressLink address={program.programID} showCopy />
          </div>
        </div>
        <div className="invisible flex items-center gap-1 text-secondary">
          <span>Deployed at:</span>
          <span>
            <SlotLink slot={program.lastDeploySlot} />
          </span>
        </div>
      </div>
      <div>{actions}</div>
    </div>
  );
};
