import {
  findOwnerInvokerAddress,
  findWalletDerivedAddress,
} from "@gokiprotocol/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { useSmartWallet } from "@/hooks/tribeca/useSmartWallet";
import { AddressLink } from "@/components/tribeca/common/AddressLink";

export const SubaccountsSection: React.FC = () => {
  const { key } = useSmartWallet();

  const { data: subaccounts } = useQuery({
    queryKey: ["smartWalletSubaccounts", key.toString()],
    queryFn: async () => {
      const ownerInvokers = await Promise.all(
        Array(3)
          .fill(null)
          .map(async (_, i) => {
            const [address] = await findOwnerInvokerAddress(key, i);
            return {
              index: i,
              address,
            };
          })
      );
      const derived = await Promise.all(
        Array(3)
          .fill(null)
          .map(async (_, i) => {
            const [address] = await findWalletDerivedAddress(key, i);
            return {
              index: i,
              address,
            };
          })
      );
      return { ownerInvokers, derived };
    },
  });

  return (
    <div>
      <h2 className="text-xl font-medium mb-1">Subaccounts</h2>

      <div className="text-sm">
        {subaccounts?.ownerInvokers.map(({ index, address }) => {
          return (
            <div
              key={`owner_invoker_${index}`}
              className="h-11 flex items-center justify-between border-b px-2"
            >
              <div>
                <code>owner_invoker/{index}</code>
              </div>
              <AddressLink address={address} showCopy />
            </div>
          );
        })}
      </div>
      <div className="text-sm">
        {subaccounts?.derived.map(({ index, address }) => {
          return (
            <div
              key={`derived_${index}`}
              className="h-11 flex items-center justify-between border-b px-2"
            >
              <div>
                <code>derived/{index}</code>
              </div>
              <AddressLink address={address} showCopy />
            </div>
          );
        })}
      </div>
    </div>
  );
};
