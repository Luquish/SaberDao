import type { PublicKey } from "@solana/web3.js";

import { TableCardBody } from "../../../../common/card/TableCardBody";
import { DisplayValue } from "../../../../common/DisplayValue";
import { Card } from "../../../../common/governance/Card";
import { AddressWithContext } from "../../../../common/program/AddressWithContext";
import type { DAOConfig } from ".";

interface Props {
  config: DAOConfig;
  addresses: {
    govWallet?: PublicKey;
    gov?: PublicKey;
    locker?: PublicKey;
  };
}

export const DAOConfigRenderer: React.FC<Props> = ({
  config,
  addresses: { govWallet, gov, locker },
}: Props) => {
  return (
    <div tw="flex flex-col gap-4">
      <Card title="Addresses">
        <TableCardBody>
          <tr>
            <td>Executive Council</td>
            <td>
              <AddressWithContext pubkey={config.executiveCouncil} />
            </td>
          </tr>
          <tr>
            <td>Emergency DAO</td>
            <td>
              <AddressWithContext pubkey={config.emergencyDao} />
            </td>
          </tr>
          <tr>
            <td>Governor Smart Wallet</td>
            <td>
              {govWallet ? <AddressWithContext pubkey={govWallet} /> : "--"}
            </td>
          </tr>
          <tr>
            <td>Governor</td>
            <td>{gov ? <AddressWithContext pubkey={gov} /> : "--"}</td>
          </tr>
          <tr>
            <td>Locker</td>
            <td>{locker ? <AddressWithContext pubkey={locker} /> : "--"}</td>
          </tr>
        </TableCardBody>
      </Card>
      <Card title="Locker">
        <TableCardBody>
          <tr>
            <td>Max Stake Vote Multiplier</td>
            <td>{config.locker.maxStakeVoteMultiplier}</td>
          </tr>
          <tr>
            <td>Min Stake Duration</td>
            <td>{config.locker.minStakeDuration}</td>
          </tr>
          <tr>
            <td>Max Stake Duration</td>
            <td>{config.locker.maxStakeDuration}</td>
          </tr>
          <tr>
            <td>Proposal Activation Min Votes</td>
            <td>{config.locker.proposalActivationMinVotes}</td>
          </tr>
          <tr>
            <td>Whitelist Enabled</td>
            <td>
              <DisplayValue value={config.locker.whitelistEnabled} />
            </td>
          </tr>
        </TableCardBody>
      </Card>
      <Card title="Governor">
        <TableCardBody>
          <tr>
            <td>Quorum Votes</td>
            <td>{config.governor.quorumVotes}</td>
          </tr>
          <tr>
            <td>Token</td>
            <td>
              <DisplayValue value={config.governor.token} />
            </td>
          </tr>
          <tr>
            <td>Voting Delay</td>
            <td>
              <DisplayValue value={config.governor.votingDelay} />
            </td>
          </tr>
          <tr>
            <td>Timelock Delay</td>
            <td>
              <DisplayValue value={config.governor.timelockDelay} />
            </td>
          </tr>
        </TableCardBody>
      </Card>
    </div>
  );
};
