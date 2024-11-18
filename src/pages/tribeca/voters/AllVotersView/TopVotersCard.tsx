import React from "react";

import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { formatSignificantDistance } from "@/utils/tribeca/format";
import { TableCardBody } from "@/components/tribeca/common/card/TableCardBody";
import { Card } from "@/components/tribeca/common/governance/Card";
import { Profile } from "@/components/tribeca/common/governance/Profile";
import { TokenAmountDisplay } from "@/components/tribeca/common/TokenAmountDisplay";
import { useVotersList } from "./useVotersList";

export const TopVotersCard: React.FC = () => {
  const { path } = useGovernor();
  const { data: voters } = useVotersList();
  return (
    <Card title={`Addresses by Voting Weight`}>
      {voters && (
        <div className="whitespace-nowrap overflow-x-auto">
          <TableCardBody
            head={
              <tr>
                <th>Rank</th>
                <th>Locked Balance</th>
                <th>ve Weight</th>
                <th>Lock Duration</th>
              </tr>
            }
          >
            {voters.voters.slice(0, 50).map((voter, i) => (
              <tr key={voter.escrow.toString()}>
                <td>
                  <div className="flex items-center gap-4">
                    <div className="w-4">{i + 1}</div>
                    <Profile
                      address={voter.owner}
                      href={`${path}/address/${voter.owner.toString()}`}
                    />
                  </div>
                </td>
                <td>
                  <TokenAmountDisplay amount={voter.amount} />
                </td>
                <td>
                  <TokenAmountDisplay amount={voter.latestPower} />
                </td>
                <td>
                  {formatSignificantDistance(voter.escrowEndsAt, new Date())}
                </td>
              </tr>
            ))}
          </TableCardBody>
        </div>
      )}
    </Card>
  );
};
