import {
  buildStubbedTransaction,
  createMemoInstruction,
} from "@saberhq/solana-contrib";
import { useEffect, useState } from "react";

import { Textarea } from "@/components/tribeca/common/inputs/InputText";
import { serializeToBase64 } from "@/utils/tribeca/makeTransaction";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import type { ActionFormProps } from "./types";
import React from "react";
export const Memo: React.FC<ActionFormProps> = ({
  actor,
  setError,
  setTxRaw,
}: ActionFormProps) => {
  const [memo, setMemo] = useState<string>("");
  const { network } = useEnvironment();

  useEffect(() => {
    if (memo === "") {
      setError("Memo cannot be empty");
    }
  }, [memo, setError]);

  return (
    <>
      <label className="flex flex-col gap-1" htmlFor="memo">
        <span className="text-sm">Memo</span>
        <Textarea
          id="memo"
          className="h-auto"
          rows={4}
          placeholder="The memo for the DAO to send."
          value={memo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setMemo(e.target.value);
            try {
              const txStub = buildStubbedTransaction(
                network !== "localnet" ? network : "devnet",
                [createMemoInstruction(e.target.value, [actor])]
              );
              setTxRaw(serializeToBase64(txStub));
              setError(null);
            } catch (ex) {
              setTxRaw("");
              console.debug("Error creating memo", ex);
              setError("Memo is too long");
            }
          }}
        />
      </label>
    </>
  );
};
