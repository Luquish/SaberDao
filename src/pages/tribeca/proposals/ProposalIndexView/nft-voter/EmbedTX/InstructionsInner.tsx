import { useTransaction } from "../../../../wallet/tx/TransactionView/context";
import { InstructionPreview } from "./InstructionPreview";
import React from "react";

export const InstructionsInner: React.FC = () => {
  const { instructions } = useTransaction();
  return (
    <div className="grid gap-4">
      {instructions?.map((instruction, i) => (
        <InstructionPreview
          key={`ix_${i}`}
          instruction={instruction}
          index={i}
        />
      ))}
    </div>
  );
};
