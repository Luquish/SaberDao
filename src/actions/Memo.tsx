import {
  buildStubbedTransaction,
  createMemoInstruction,
} from "@saberhq/solana-contrib";
import { useEffect, useState } from "react";

import { Textarea } from "../components/common/inputs/InputText";
import { serializeToBase64 } from "../utils/makeTransaction";
import { useEnvironment } from "../utils/useEnvironment";
import type { ActionFormProps } from "./types";

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
      <label tw="flex flex-col gap-1" htmlFor="memo">
        <span tw="text-sm">Memo</span>
        <Textarea
          id="memo"
          tw="h-auto"
          rows={4}
          placeholder="The memo for the DAO to send."
          value={memo}
          onChange={(e) => {
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
