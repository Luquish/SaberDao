import React from "react";
import { useUserATAs } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";

import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { AddressWithContext } from "@/components/tribeca/common/program/AddressWithContext";
import type { BulkStreamConfig } from "./BulkCreateStream";

interface Props {
  config: BulkStreamConfig;
}

export const BulkStreamConfigRenderer: React.FC<Props> = ({
  config,
}: Props) => {
  const total = config.recipients.reduce(
    (acc, el) => el.amount.add(acc),
    new TokenAmount(config.token, 0)
  );
  const [balance] = useUserATAs(config.token);
  return (
    <div>
      <div>You are about to issue the following streams:</div>
      <AttributeList
        attributes={{
          Start: config.start,
          End: config.end,
          "Revocable?": config.revocable,
          Token: config.token,
          Total: total,
          "Your Balance": balance?.balance,
        }}
      />
      {!balance || balance.balance.lessThan(total) ? (
        <div>Insufficient balance</div>
      ) : null}
      <div className="flex flex-col text-sm">
        {config.recipients.map((rec) => (
          <div key={rec.name} className="flex flex-col gap-1 py-4 border-b">
            <div className="flex justify-between">
              <span>{rec.name}</span>
              <span>{rec.amount.formatUnits()}</span>
            </div>
            <div>
              <AddressWithContext pubkey={rec.address} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
