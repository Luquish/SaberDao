import {
  findEpochGaugeVoterAddress,
  findGaugeVoteAddress,
  findGaugeVoterAddress,
  GAUGE_CODERS,
  GaugeSDK,
} from "@quarryprotocol/gauge";
import { useSail } from "@rockooor/sail";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { findEscrowAddress } from "@tribecahq/tribeca-sdk";
import { chunk } from "lodash";
import { useCallback } from "react";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../../contexts/sdk";
import { ModalInner } from "../../../../../common/Modal/ModalInner";
import { TransactionPlanExecutor } from "../../../../../common/TransactionPlanExecutor";
import type { TransactionPlan } from "../../../../../common/TransactionPlanExecutor/plan";
import { useGaugemeister, useGMData } from "../../hooks/useGaugemeister";
import { useAllGauges } from "../../hooks/useGauges";

export const SyncModal: React.FC = () => {
  const { sdkMut } = useSDK();
  const { gaugeKeys } = useAllGauges();
  const { data: gmData } = useGMData();
  const gaugemeister = useGaugemeister();
  const { refetchMany } = useSail();

  const makePlan = useCallback(async () => {
    invariant(sdkMut && gaugemeister && gaugeKeys && gmData);

    const plan: TransactionPlan = { steps: [] };

    const [escrow] = await findEscrowAddress(
      gmData.account.locker,
      sdkMut.provider.wallet.publicKey
    );
    const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrow);
    const gauge = GaugeSDK.load({ provider: sdkMut.provider });

    // revert the votes in per 100 chunks
    const chunks = chunk(gaugeKeys, 100);
    const revertTXs = (
      await Promise.all(
        chunks.map(async (chunk) =>
          gauge.gauge.revertVotes({
            gaugemeister,
            gauges: chunk,
          })
        )
      )
    ).flat();

    if (revertTXs.length) {
      plan.steps.push({
        title: "Revert Votes",
        txs: TransactionEnvelope.pack(...revertTXs),
      });
    }

    // provision the epoch gauge voter if applicable
    const [epochGaugeVoter] = await findEpochGaugeVoterAddress(
      gaugeVoter,
      gmData.account.currentRewardsEpoch + 1
    );
    const epochGaugeVoterData = await gauge.gauge.fetchEpochGaugeVoter(
      epochGaugeVoter
    );
    if (epochGaugeVoterData) {
      if (!epochGaugeVoterData.allocatedPower.isZero()) {
        plan.steps.push({
          title: "Reset Committed Votes",
          txs: [
            await gauge.gauge.resetEpochGaugeVoter({
              gaugemeister,
            }),
          ],
        });
      }
    } else {
      plan.steps.push({
        title: "Prepare Votes",
        txs: [
          await gauge.gauge.prepareEpochGaugeVoter({
            gaugemeister,
          }),
        ],
      });
    }
    console.log(6);
    const gaugeVoteKeys = await Promise.all(
      gaugeKeys.map(async (gaugeKey) => {
        const [gaugeVoteKey] = await findGaugeVoteAddress(gaugeVoter, gaugeKey);
        return gaugeVoteKey;
      })
    );
    const gaugeVotes = await refetchMany(gaugeVoteKeys);
    const parsedGaugeVotes = gaugeVotes.map((gv) =>
      gv && "data" in gv
        ? GAUGE_CODERS.Gauge.accounts.gaugeVote.parse(gv.data)
        : null
    );

    const gaugesToCommit = gaugeKeys.filter((gk) => {
      const gaugeVote = parsedGaugeVotes.find((gv) => gv?.gauge.equals(gk));
      return gaugeVote && gaugeVote.weight !== 0;
    });
    console.log(7);

    // commit the votes
    const voteTXs = await gauge.gauge.commitVotes({
      gaugemeister,
      gauges: gaugesToCommit,
    });
    plan.steps.push({
      title: "Commit Votes",
      txs: TransactionEnvelope.pack(...voteTXs),
    });

    return plan;

    console.log(8);
  }, [gaugeKeys, gaugemeister, gmData, refetchMany, sdkMut]);

  return (
    <ModalInner title="Sync">
      <TransactionPlanExecutor makePlan={makePlan} onComplete={close} />
    </ModalInner>
  );
};
