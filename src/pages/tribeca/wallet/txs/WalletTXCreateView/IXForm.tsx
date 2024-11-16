import type { SmartWalletWrapper } from "@gokiprotocol/client";
import type { Accounts, Program } from "@project-serum/anchor";
import type { InstructionDisplay } from "@project-serum/anchor/dist/cjs/coder/borsh/instruction";
import type {
  IdlAccountItem,
  IdlField,
  IdlTypeDef,
} from "@project-serum/anchor/dist/esm/idl";
import { formatIdlType, SuperCoder } from "@saberhq/anchor-contrib";
import { createMemoInstruction } from "@saberhq/solana-contrib";
import { u64 } from "@saberhq/token-utils";
import type { TransactionInstruction } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import copyToClipboard from "copy-to-clipboard";
import { set, startCase } from "lodash-es";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";

import { COMMON_ACCOUNTS } from "../../../../../utils/anchor";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";
import type { InstructionInfo } from ".";
import { AccountsForm } from "./AccountsForm";
import { PreviewIXModal } from "./PreviewIXModal";

interface Props {
  ix: InstructionInfo;
  program: Program;
  smartWallet?: SmartWalletWrapper | null;
  types?: IdlTypeDef[];
}

const makeIX = ({
  program,
  ix,
  rawArgs,
  accountsStrs,
}: {
  program: Program;
  ix: InstructionInfo;
  rawArgs: string[];
  accountsStrs: Record<string, string>;
}): {
  txInstruction: TransactionInstruction;
  formatted: InstructionDisplay;
} => {
  const accounts: Accounts = {};
  Object.entries(accountsStrs).forEach(([key, account]) => {
    set(accounts, key, account);
  });

  const buildIX = program.instruction[ix.instruction.name];
  if (!buildIX) {
    throw new Error(`unknown instruction: ${ix.instruction.name}`);
  }

  const parsedArgs = rawArgs.map((arg, i) => {
    const cfg = ix.instruction.args[i];
    if (!cfg) {
      return arg;
    }
    if (cfg.type === "u64") {
      return new u64(arg);
    }
    if (typeof cfg.type !== "string") {
      return JSON.parse(arg) as unknown;
    }
  });

  const txInstruction = buildIX(...parsedArgs, {
    accounts,
  });

  const coder = new SuperCoder(program.programId, program.idl);
  const formatted = coder.parseInstruction(txInstruction);
  return {
    txInstruction,
    formatted,
  };
};

const makeDefaults = (accounts: IdlAccountItem[]): Record<string, string> => {
  const result: Record<string, string> = {};
  accounts.forEach((item) => {
    if ("accounts" in item) {
      const other = makeDefaults(item.accounts);
      Object.entries(other).forEach(([otherKey, otherAddr]) => {
        result[`${item.name}.${otherKey}`] = otherAddr;
      });
      return;
    }
    const common = COMMON_ACCOUNTS[item.name];
    if (common) {
      result[item.name] = common.toString();
    }
  });
  return result;
};

export const IXForm: React.FC<Props> = ({
  ix,
  program,
  smartWallet,
  types = [],
}: Props) => {
  const [rawArgs, setRawArgs] = useState<string[]>(
    new Array(ix.instruction.args.length).map(() => "")
  );
  const [accountsStrs, setAccountsStrs] = useState<Record<string, string>>(
    makeDefaults(ix.instruction.accounts)
  );
  const [memo, setMemo] = useState<string>("");

  const builtIX = useMemo(() => {
    try {
      return makeIX({ program, ix, rawArgs, accountsStrs });
    } catch (e) {
      console.error("ERROR", e);
      // ignore
      return null;
    }
  }, [accountsStrs, ix, program, rawArgs]);

  const [showPreview, setShowPreview] = useState<boolean>(false);

  const renderInputTextBox = (field: IdlField, index: number) => {
    return (
      <InputText
        key={field.name}
        type="text"
        placeholder={field.name}
        value={(rawArgs[index] as string | null | undefined)?.toString() ?? ""}
        onChange={(e) => {
          setRawArgs((prev) => {
            const next = prev.slice();
            next[index] = e.target.value;
            return next;
          });
        }}
      />
    );
  };

  const renderUserDefinedTypes = (typeDef: IdlTypeDef | undefined) => {
    if (!typeDef) {
      return <div>Unsupported</div>;
    }

    switch (typeDef.type.kind) {
      case "struct":
        return (
          <div>
            <div tw="grid gap-2">
              {typeDef.type.fields.map((f, i) => (
                <>
                  <span>
                    {startCase(f.name)} ({formatIdlType(f.type)})
                  </span>
                  {renderInputTextBox(f, i)}
                </>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Unsupported</div>;
    }
  };

  const renderIdlField = (field: IdlField, index: number) => {
    if (typeof field.type === "string") {
      return renderInputTextBox(field, index);
    }

    if ("struct" in field) {
      return renderUserDefinedTypes(
        types.find((t) => t.name === formatIdlType(field.type))
      );
    }

    return <div>Unsupported</div>;
  };

  return (
    <div tw="grid gap-4">
      {builtIX && (
        <PreviewIXModal
          ix={ix}
          txInstructions={
            memo === ""
              ? [builtIX.txInstruction]
              : [builtIX.txInstruction, createMemoInstruction(memo, [])]
          }
          formatted={builtIX.formatted}
          isOpen={showPreview}
          smartWallet={smartWallet}
          onDismiss={() => {
            setShowPreview(false);
          }}
        />
      )}
      <h2 tw="text-xl font-semibold mb-4">{startCase(ix.instruction.name)}</h2>
      {ix.instruction.args.length > 0 && (
        <div>
          <h3 tw="text-lg font-semibold mb-2">Arguments</h3>
          <div tw="grid gap-2">
            {ix.instruction.args.map((arg, i) => (
              <label key={`arg_${i}`} tw="grid gap-1 grid-cols-2">
                <span>
                  {startCase(arg.name)} ({formatIdlType(arg.type)})
                </span>
                {renderIdlField(arg, i)}
              </label>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 tw="text-lg font-semibold mb-2">Accounts</h3>
        <div>
          <AccountsForm
            accountItems={ix.instruction.accounts}
            accountsStrs={accountsStrs}
            prefix=""
            onChange={(path, key) => {
              setAccountsStrs((value) => ({
                ...value,
                [path]: key,
              }));
            }}
          />
        </div>
      </div>
      <div tw="flex flex-col gap-2 text-sm">
        <span tw="font-medium">Memo (optional)</span>
        <InputText
          type="text"
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value);
          }}
        />
      </div>
      <div tw="flex gap-2">
        <Button
          disabled={!builtIX}
          type="button"
          variant="primary"
          onClick={() => {
            setShowPreview(true);
          }}
        >
          Preview Instruction
        </Button>
        <Button
          type="button"
          disabled={!builtIX}
          onClick={() => {
            invariant(builtIX);

            const tx = new Transaction();
            tx.recentBlockhash = "GfVcyD4kkTrj4bKc7WA9sZCin9JDbdT4Zkd3EittNR1W";
            tx.feePayer = builtIX.txInstruction.programId;
            tx.instructions = [builtIX.txInstruction];

            copyToClipboard(
              tx
                .serialize({
                  requireAllSignatures: false,
                  verifySignatures: false,
                })
                .toString("base64")
            );
          }}
        >
          Copy as base64
        </Button>
      </div>
    </div>
  );
};
