import type { PublicKey } from "@solana/web3.js";
import React from "react";

import { AddressWithContext } from "@/components/tribeca/common/program/AddressWithContext";
import { Box } from "./Box";

interface Props {
  accounts: {
    name?: string;
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }[];
}

export const IXAccounts: React.FC<Props> = ({ accounts }: Props) => {
  return (
    <Box title={`Accounts (${accounts.length})`} className="p-0">
      <div className="overflow-x-auto whitespace-nowrap">
        {accounts.map((account, i) => {
          return (
            <div
              key={`account_${i}`}
              className="px-6 py-2 flex items-center gap-4 justify-between border-t border-t-gray-150 dark:border-t-warmGray-600"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-semibold">
                  {account.name ?? `Account #${i}`}
                </span>
                <div className="flex items-center gap-2">
                  {account.isWritable && (
                    <div className="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <span>writable</span>
                    </div>
                  )}
                  {account.isSigner && (
                    <div className="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                      <div className="h-2 w-2 bg-accent rounded-full" />
                      <span>signer</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-gray-800 font-medium flex-shrink-0">
                <AddressWithContext
                  pubkey={account.pubkey}
                  prefixLinkUrlWithAnchor
                />
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
};
