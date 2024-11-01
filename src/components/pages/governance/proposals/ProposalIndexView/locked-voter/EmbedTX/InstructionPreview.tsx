import { startCase } from "lodash-es";

import { useParsedInstruction } from "../../../../../../../hooks/tx/useParsedInstruction";
import type { ParsedInstruction } from "../../../../../../../hooks/useSmartWallet";
import { shortenAddress } from "../../../../../../../utils/utils";
import { AddressLink } from "../../../../../../common/AddressLink";
import { InstructionDisplay } from "../../../../../wallet/tx/TransactionView/TransactionIndexView/InstructionDisplay";

interface Props {
  index: number;
  instruction: ParsedInstruction;
}

export const InstructionPreview: React.FC<Props> = ({
  instruction,
  index,
}: Props) => {
  const parsed = useParsedInstruction(instruction.ix);
  return (
    <div tw="grid border dark:border-warmGray-700 rounded">
      <div tw="text-sm p-4">
        <h2 tw="font-semibold text-gray-800 dark:text-white mb-2">
          IX #{index + 1}:{" "}
          {parsed?.title ??
            startCase(
              (instruction.parsed && "name" in instruction.parsed
                ? instruction.parsed.name
                : null) ?? "Unknown"
            )}
        </h2>
        <p tw="text-xs text-gray-500">
          <span tw="font-medium">Program:</span>{" "}
          <AddressLink
            tw="font-semibold text-secondary"
            address={instruction.ix.programId}
          >
            {instruction.programName} (
            {shortenAddress(instruction.ix.programId.toString())})
          </AddressLink>
        </p>
      </div>
      <div tw="p-4 border-t dark:border-t-warmGray-600">
        <InstructionDisplay parsed={parsed} instruction={instruction} />
      </div>
    </div>
  );
};
