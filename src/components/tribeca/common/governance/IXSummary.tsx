import type { ProposalInstruction } from "@tribecahq/tribeca-sdk";
import React from "react";

import { InstructionSummary } from "@/components/tribeca/common/program/InstructionSummary";

interface Props {
  instruction: ProposalInstruction;
}

export default function IXSummary({ instruction }: Props) {
  return <InstructionSummary instruction={instruction} />;
};
