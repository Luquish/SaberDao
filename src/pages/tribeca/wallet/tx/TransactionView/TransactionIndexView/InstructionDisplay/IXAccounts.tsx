import type { PublicKey } from "@solana/web3.js";

import { AddressWithContext } from "@/common/program/AddressWithContext";
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
    <Box title={`Accounts (${accounts.length})`} tw="p-0">
      <div tw="overflow-x-auto whitespace-nowrap">
        {accounts.map((account, i) => {
          return (
            <div
              key={`account_${i}`}
              tw="px-6 py-2 flex items-center gap-4 justify-between border-t border-t-gray-150 dark:border-t-warmGray-600"
            >
              <div tw="flex items-center gap-4">
                <span tw="text-gray-500 font-semibold">
                  {account.name ?? `Account #${i}`}
                </span>
                <div tw="flex items-center gap-2">
                  {account.isWritable && (
                    <div tw="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                      <div tw="h-2 w-2 bg-primary rounded-full" />
                      <span>writable</span>
                    </div>
                  )}
                  {account.isSigner && (
                    <div tw="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                      <div tw="h-2 w-2 bg-accent rounded-full" />
                      <span>signer</span>
                    </div>
                  )}
                </div>
              </div>
              <div tw="text-gray-800 font-medium flex-shrink-0">
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
