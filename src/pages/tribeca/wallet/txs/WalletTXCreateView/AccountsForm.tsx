import type { IdlAccountItem } from "@project-serum/anchor/dist/esm/idl";
import { startCase } from "lodash-es";
import React from "react";

import { InputText } from "@/components/tribeca/common/inputs/InputText";

interface Props {
  accountItems: IdlAccountItem[];
  accountsStrs: Record<string, string>;
  prefix: string;
  onChange: (path: string, key: string) => void;
}

const AccountsForm: React.FC<Props> = ({
  accountItems,
  accountsStrs,
  prefix,
  onChange,
}: Props) => {
  return (
    <div className="grid gap-2">
      {accountItems.map((account) =>
        "accounts" in account ? (
          <div className="border p-4">
            <span>{account.name}</span>
            <div>
              <AccountsForm
                key={account.name}
                accountItems={account.accounts}
                accountsStrs={accountsStrs}
                prefix={`${account.name}.`}
                onChange={onChange}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-1 grid-cols-2">
            <div className="flex items-center gap-2">
              <span>{startCase(account.name)}</span>
              {account.isMut && (
                <span className="rounded bg-primary text-white px-1 py-0.5">
                  writable
                </span>
              )}
              {account.isSigner && (
                <span className="rounded bg-accent text-white px-1 py-0.5">
                  signer
                </span>
              )}
            </div>
            <InputText
              key={account.name}
              type="text"
              placeholder={account.name}
              value={accountsStrs[`${prefix}${account.name}`] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(`${prefix}${account.name}`, e.target.value);
              }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default AccountsForm;
