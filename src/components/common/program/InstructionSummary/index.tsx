import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import type { ProposalInstruction } from "@tribecahq/tribeca-sdk";

import { useParsedProposalInstruction } from "../../../../hooks/tx/useParsedInstruction";
import { BPF_UPGRADEABLE_LOADER_ID } from "../../../../hooks/useAuthorityPrograms";
import type { TokenInstructionInner } from "../../../../utils/instructions/token/parsers";
import type { UpgradeableLoaderInstructionData } from "../../../../utils/instructions/upgradeable_loader/parsers";
import { UpgradeProgramInstruction } from "./bpf_upgradeable/UpgradeProgramInstruction";
import { TokenTransferInstruction } from "./token/TokenTransferInstruction";

interface Props {
  instruction: ProposalInstruction;
}

/**
 * Human readable summary of an instruction.
 *
 * This is not just text.
 *
 * @param param0
 * @returns
 */
export const InstructionSummary: React.FC<Props> = ({ instruction }: Props) => {
  const ix = useParsedProposalInstruction(instruction);

  if (
    ix.programID.equals(BPF_UPGRADEABLE_LOADER_ID) &&
    ix.data.type === "object"
  ) {
    const result = ix.data.args as UpgradeableLoaderInstructionData;
    if (result.type === "upgrade") {
      return <UpgradeProgramInstruction data={ix} />;
    }
  }

  if (ix.programID.equals(TOKEN_PROGRAM_ID) && ix.data?.type === "object") {
    const result = ix.data.args as TokenInstructionInner;
    if (result.type === "transfer" && result.data) {
      return <TokenTransferInstruction transfer={result.data} />;
    }
  }

  return <>{ix.title}</>;
};
