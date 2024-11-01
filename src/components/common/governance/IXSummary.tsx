import type { ProposalInstruction } from "@tribecahq/tribeca-sdk";

import { InstructionSummary } from "../program/InstructionSummary";

interface Props {
  instruction: ProposalInstruction;
}

export const IXSummary: React.FC<Props> = ({ instruction }: Props) => {
  return <InstructionSummary instruction={instruction} />;
};
