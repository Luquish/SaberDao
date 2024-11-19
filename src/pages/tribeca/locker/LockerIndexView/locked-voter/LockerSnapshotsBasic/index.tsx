import { useSail, useTXHandlers } from "@rockooor/sail";
import type { PublicKey } from "@solana/web3.js";
import { DEFAULT_LOCKER_PARAMS } from "@tribecahq/tribeca-sdk";
import invariant from "tiny-invariant";
import React from "react";

import { useSDK } from "@/contexts/sdk";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { Alert } from "@/components/tribeca/common/Alert";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import Card from "@/components/tribeca/common/governance/Card";
import CardWithImage from "@/components/tribeca/common/governance/CardWithImage";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
import {
  createAndSyncSnapshots,
  syncSnapshots,
  useSnapshotHistories,
} from "@/hooks/tribeca/useSnapshotHistories";
import TimeTravel from "@/pages/tribeca/locker/LockerIndexView/locked-voter/LockerSnapshotsBasic/TimeTravel.svg";

interface Props {
  owner?: PublicKey | null;
}

const LockerSnapshotsBasic: React.FC<Props> = ({ owner }: Props) => {
  const { tribecaMut } = useSDK();
  const { refetchMany } = useSail();
  const { wrapTx } = useWrapTx();
  const {
    eras,
    lockerKey,
    escrow,
    escrowKey,
    hasMissingHistories,
    estimatedCost,
    unsyncedSnapshots,
  } = useSnapshotHistories(owner ?? tribecaMut?.provider.walletKey);
  const { lockerData } = useGovernor();

  const { signAndConfirmTXs } = useTXHandlers();

  // TODO(michael): Remove this condition when we're ready for launch.
  if (
    !owner ||
    escrow?.escrow.amount.gte(
      lockerData?.account.params.proposalActivationMinVotes ??
        DEFAULT_LOCKER_PARAMS.proposalActivationMinVotes
    )
  ) {
    return <div />;
  }

  if (hasMissingHistories) {
    return (
      <CardWithImage
        title="Set up Snapshots"
        image={
          <div className="flex items-center justify-center p-8">
            <TimeTravel className="w-3/4 h-3/4 text-primary" />
          </div>
        }
      >
        <ProseSmall>
          <p>
            Create snapshots of your vote escrow in order to earn rewards and
            participate in airdrops.
          </p>
          <ExternalLink href="https://docs.tribeca.so/features/snapshots">
            Learn more about Snapshots
          </ExternalLink>
          <AsyncButton
            className="mt-4"
            variant="primary"
            disabled={!lockerKey || !escrowKey}
            onClick={async (sdkMut) => {
              invariant(lockerKey && escrowKey);
              const { createTXs, syncTXs } = await createAndSyncSnapshots({
                provider: sdkMut.provider,
                refetchMany,
                locker: lockerKey,
                escrow: escrowKey,
                eras,
              });
              await signAndConfirmTXs(
                await wrapTx(createTXs.slice()),
                "Create Snapshots"
              );
              await signAndConfirmTXs(
                await wrapTx(syncTXs.slice()),
                "Sync Snapshots"
              );
            }}
          >
            Setup (costs ~{estimatedCost?.formatUnits()})
          </AsyncButton>
        </ProseSmall>
      </CardWithImage>
    );
  }

  return (
    <>
      {escrow?.escrow.amount.gte(
        // TODO(michael): Remove this condition when we're ready for launch.
        lockerData?.account.params.proposalActivationMinVotes ??
          DEFAULT_LOCKER_PARAMS.proposalActivationMinVotes
      ) && (
        <Card title="Snapshots" padded>
          {unsyncedSnapshots && unsyncedSnapshots.length > 0 ? (
            <div>
              <Alert>
                <ProseSmall>
                  <h2>Your snapshots are out of sync</h2>
                  <p>
                    Your balance snapshots are out of sync. You could be missing
                    out on reward distributions or airdrops.
                  </p>
                  <ExternalLink href="https://docs.tribeca.so/features/snapshots">
                    Learn more about Snapshots
                  </ExternalLink>
                  <AsyncButton
                    className="mt-4"
                    variant="primary"
                    onClick={async (sdkMut) => {
                      invariant(lockerKey && escrowKey);
                      const syncTXs = await syncSnapshots({
                        provider: sdkMut.provider,
                        locker: lockerKey,
                        escrow: escrowKey,
                        eras: unsyncedSnapshots,
                      });
                      await signAndConfirmTXs(
                        await wrapTx(syncTXs),
                        "Sync Snapshots"
                      );
                    }}
                  >
                    Sync Snapshots ({unsyncedSnapshots.length} TXs)
                  </AsyncButton>
                </ProseSmall>
              </Alert>
            </div>
          ) : (
            <div className="text-center">
              Your balance snapshots are up to date. 👍
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default LockerSnapshotsBasic;
