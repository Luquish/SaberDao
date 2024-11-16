import { useUserATAs } from "@rockooor/sail";
import { TokenAmount } from "@saberhq/token-utils";

import { AttributeList } from "../../../../../common/AttributeList";
import { AddressWithContext } from "../../../../../common/program/AddressWithContext";
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
      <div tw="flex flex-col text-sm">
        {config.recipients.map((rec) => (
          <div key={rec.name} tw="flex flex-col gap-1 py-4 border-b">
            <div tw="flex justify-between">
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
