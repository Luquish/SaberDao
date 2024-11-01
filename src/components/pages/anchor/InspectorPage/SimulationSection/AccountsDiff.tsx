import type { Message, SimulatedTransactionResponse } from "@solana/web3.js";

import { Card } from "../../../../common/governance/Card";
import { AccountDiff } from "./AccountDiff";

interface Props {
  message: Message;
  response: SimulatedTransactionResponse;
}

export const AccountsDiff: React.FC<Props> = ({ message, response }: Props) => {
  return (
    <Card title="Simulated Changes">
      <div tw="w-full whitespace-nowrap overflow-x-auto">
        <div tw="grid">
          {response.accounts?.map((value, i) => {
            const isWritable = message.isAccountWritable(i);
            if (!isWritable) {
              return null;
            }
            const accountId = message.accountKeys[i];
            if (!accountId || !value) {
              return null;
            }
            return (
              <AccountDiff key={i} accountId={accountId} nextInfo={value} />
            );
          })}
        </div>
      </div>
    </Card>
  );
};
