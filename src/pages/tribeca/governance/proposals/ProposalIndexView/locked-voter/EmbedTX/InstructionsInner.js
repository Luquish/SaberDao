import { useTransaction } from "../../../../../wallet/tx/TransactionView/context";
import { InstructionPreview } from "./InstructionPreview";
export const InstructionsInner = () => {
    const { instructions } = useTransaction();
    return (React.createElement("div", { tw: "grid gap-4" }, instructions?.map((instruction, i) => (React.createElement(InstructionPreview, { key: `ix_${i}`, instruction: instruction, index: i })))));
};
