import type { EscrowHistoryData, LockerHistoryData } from "@saberhq/snapshots";
import { calculatePeriodStart } from "@saberhq/snapshots";
import type { ProgramAccount } from "@saberhq/token-utils";
import { Percent } from "@saberhq/token-utils";
import type { PublicKey } from "@solana/web3.js";
import { zip } from "lodash-es";

import { useSDK } from "../../../../../contexts/sdk";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { useSnapshotHistories } from "../../locker/LockerIndexView/locked-voter/LockerSnapshots/useSnapshotHistories";

interface Props {
  owner?: PublicKey | null;
}

export const AllLockerSnapshotsTable: React.FC<Props> = ({ owner }: Props) => {
  const { tribecaMut } = useSDK();
  const { lockerHistories, escrowHistories, eras } = useSnapshotHistories(
    owner ?? tribecaMut?.provider.walletKey
  );

  const all = eras.flatMap((era, i) => {
    const lockerHistory: ProgramAccount<LockerHistoryData> | undefined | null =
      lockerHistories?.[i];
    const escrowHistory: ProgramAccount<EscrowHistoryData> | undefined | null =
      escrowHistories?.[i];
    if (!lockerHistory || !escrowHistory) {
      return [];
    }
    return zip(
      lockerHistory.account.veBalances,
      escrowHistory.account.veBalances
    ).map(([lockerBalance, escrowBalance], period) => {
      return {
        lockerBalance,
        escrowBalance,
        era,
        period,
      };
    });
  });

  return (
    <Card title="All Snapshots">
      <TableCardBody
        head={
          <tr>
            <th>Start Date</th>
            <th>Era</th>
            <th>Period</th>
            <th>Escrow Balance</th>
            <th>%</th>
            <th>Locker Balance</th>
          </tr>
        }
      >
        {all.map(({ era, period, lockerBalance, escrowBalance }) => {
          const start = calculatePeriodStart(era, period);
          const percent =
            escrowBalance && lockerBalance
              ? lockerBalance.isZero()
                ? new Percent(0)
                : new Percent(escrowBalance, lockerBalance)
              : null;
          return (
            <tr key={`${era.toString()}_${period.toString()}`}>
              <td>
                <div tw="flex flex-col gap-1">
                  <span>{start.toLocaleDateString()}</span>
                </div>
              </td>
              <td>{era}</td>
              <td>{period}</td>
              <td>{escrowBalance?.toString()}</td>
              <td>
                {percent
                  ? `${percent.toSignificant(6, {
                      groupSeparator: ",",
                    })}%`
                  : "--"}
              </td>
              <td>{lockerBalance?.toString()}</td>
            </tr>
          );
        })}
      </TableCardBody>
    </Card>
  );
};
