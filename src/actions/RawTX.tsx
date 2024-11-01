import { extractErrorMessage } from "@rockooor/sail";
import { Transaction } from "@solana/web3.js";

import { HelperCard } from "../components/common/HelperCard";
import { Textarea } from "../components/common/inputs/InputText";
import { LabeledInput } from "../components/common/inputs/LabeledInput";
import type { ActionFormProps } from "./types";

export const RawTX: React.FC<ActionFormProps> = ({
  setError,
  txRaw,
  setTxRaw,
}: ActionFormProps) => {
  return (
    <>
      <HelperCard variant="warn">
        <div tw="font-semibold">
          Warning: this page is for advanced users only. Invalid transaction
          data may cause this page to freeze. Documentation will be coming soon.
        </div>
      </HelperCard>
      <HelperCard variant="muted">
        <div tw="prose prose-sm prose-light">
          <p>
            This page allows proposing any arbitrary transaction for execution
            by the DAO. The fee payer and recent blockhash will not be used.
          </p>
        </div>
      </HelperCard>
      <LabeledInput
        label="Transaction (base64)"
        Component={Textarea}
        id="instructionsRaw"
        tw="h-auto font-mono"
        rows={4}
        placeholder="Paste raw base64 encoded transaction message"
        value={txRaw}
        onChange={(e) => {
          setTxRaw(e.target.value);
          try {
            const buffer = Buffer.from(e.target.value, "base64");
            const tx = Transaction.from(buffer);
            if (tx.instructions.length === 0) {
              throw new Error("no instruction data");
            }
            setError(null);
          } catch (err) {
            setError(
              `Invalid transaction data: ${
                extractErrorMessage(err) ?? "(unknown)"
              }`
            );
          }
        }}
      />
    </>
  );
};
