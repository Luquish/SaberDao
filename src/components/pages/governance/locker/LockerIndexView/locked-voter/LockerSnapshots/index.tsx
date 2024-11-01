import {
  COMMON_ERA_UNIX_TS,
  ERA_NUM_PERIODS,
  PERIOD_SECONDS,
} from "@saberhq/snapshots";
import type { PublicKey } from "@solana/web3.js";

import { useSDK } from "../../../../../../../contexts/sdk";
import { TableCardBody } from "../../../../../../common/card/TableCardBody";
import { Card } from "../../../../../../common/governance/Card";
import { LoadingSpinner } from "../../../../../../common/LoadingSpinner";
import { CreateEscrowHistoryButton } from "./CreateEscrowHistoryButton";
import { CreateLockerHistoryButton } from "./CreateLockerHistoryButton";
import { SyncEscrowHistoryButton } from "./SyncEscrowHistoryButton";
import { useSnapshotHistories } from "./useSnapshotHistories";

const secondsPerEra = PERIOD_SECONDS * ERA_NUM_PERIODS;

const calculateEraStart = (era: number) =>
  new Date((COMMON_ERA_UNIX_TS + era * secondsPerEra) * 1_000);

interface Props {
  owner?: PublicKey | null;
}

export const LockerSnapshots: React.FC<Props> = ({ owner }: Props) => {
  const { tribecaMut } = useSDK();
  const { lockerHistories, escrowHistories, eras, lockerKey, escrow } =
    useSnapshotHistories(owner ?? tribecaMut?.provider.walletKey);

  return (
    <Card title="Snapshots">
      {lockerKey && (
        <TableCardBody
          head={
            <tr>
              <th>#</th>
              <th>Period</th>
            </tr>
          }
        >
          {eras?.map((era, i) => {
            const lockerHistory = lockerHistories?.[i];
            const escrowHistory = escrowHistories?.[i];

            const startIndex = escrowHistory?.account.veBalances.findIndex(
              (v) => !v.isZero()
            );
            const endIndexReversed = escrowHistory?.account.veBalances
              .slice()
              .reverse()
              .findIndex((v) => !v.isZero());
            const endIndex =
              endIndexReversed !== undefined
                ? endIndexReversed !== -1
                  ? ERA_NUM_PERIODS - endIndexReversed - 1
                  : -1
                : undefined;

            return (
              <tr key={era}>
                <td>{era}</td>
                <td>
                  {calculateEraStart(era).toLocaleDateString()} to{" "}
                  {calculateEraStart(era + 1).toLocaleDateString()}
                </td>
                <td>
                  <div>
                    <p>Starts: {startIndex}</p>
                    <p>Ends: {endIndex}</p>
                  </div>
                </td>
                <td>
                  {lockerHistory === undefined ||
                  (escrow && escrowHistory === undefined) ? (
                    <LoadingSpinner />
                  ) : lockerHistory === null ? (
                    <CreateLockerHistoryButton locker={lockerKey} era={era} />
                  ) : !escrowHistory ? (
                    escrow ? (
                      <CreateEscrowHistoryButton
                        escrow={escrow.escrowW.escrowKey}
                        era={era}
                      />
                    ) : (
                      "No veTokens locked"
                    )
                  ) : (
                    <SyncEscrowHistoryButton
                      lockerHistory={lockerHistory}
                      escrowHistory={escrowHistory}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </TableCardBody>
      )}
    </Card>
  );
};
