import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { formatSignificantDistance } from "../../../../../utils/format";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { Profile } from "../../../../common/governance/Profile";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { useVotersList } from "./useVotersList";

export const TopVotersCard: React.FC = () => {
  const { path } = useGovernor();
  const { data: voters } = useVotersList();
  return (
    <Card title={`Addresses by Voting Weight`}>
      {voters && (
        <div tw="whitespace-nowrap overflow-x-auto">
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
                  <div tw="flex items-center gap-4">
                    <div tw="w-4">{i + 1}</div>
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
