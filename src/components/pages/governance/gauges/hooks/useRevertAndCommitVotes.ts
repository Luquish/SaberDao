import {
  findEpochGaugeVoterAddress,
  findGaugeVoteAddress,
  findGaugeVoterAddress,
  GAUGE_CODERS,
  GaugeSDK,
} from "@quarryprotocol/gauge";
import { useSail, useTXHandlers } from "@rockooor/sail";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { findEscrowAddress } from "@tribecahq/tribeca-sdk";
import { useCallback } from "react";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { useGaugemeister, useGMData } from "./useGaugemeister";
import { useAllGauges } from "./useGauges";

export const useRevertAndCommitVotes = () => {
  const { gaugeKeys } = useAllGauges();
  const { sdkMut } = useSDK();
  const { signAndConfirmTX, signAndConfirmTXs } = useTXHandlers();
  const gaugemeister = useGaugemeister();
  const { data: gmData } = useGMData();
  const { refetchMany } = useSail();
  const { wrapTx } = useWrapTx();

  return useCallback(async () => {
    invariant(sdkMut && gaugemeister && gaugeKeys && gmData);

    const [escrow] = await findEscrowAddress(
      gmData.account.locker,
      sdkMut.provider.wallet.publicKey
    );
    const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrow);

    const gauge = GaugeSDK.load({ provider: sdkMut.provider });

    // revert the votes
    const revertTXs = await gauge.gauge.revertVotes({
      gaugemeister,
      gauges: gaugeKeys,
    });
    await signAndConfirmTXs(
      await wrapTx(TransactionEnvelope.pack(...revertTXs)),
      "Revert votes"
    );

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
        throw new Error("Must reset epoch votes first.");
      } else {
        await signAndConfirmTX(
          await wrapTx(
            await gauge.gauge.resetEpochGaugeVoter({
              gaugemeister,
            })
          ),
          "Reset committed votes"
        );
      }
    } else {
      await signAndConfirmTX(
        await wrapTx(
          await gauge.gauge.prepareEpochGaugeVoter({
            gaugemeister,
          })
        ),
        "Prepare votes"
      );
    }

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

    // commit the votes
    const voteTXs = await gauge.gauge.commitVotes({
      gaugemeister,
      gauges: gaugesToCommit,
    });
    await signAndConfirmTXs(
      await wrapTx(TransactionEnvelope.pack(...voteTXs)),
      "Commit votes"
    );
  }, [
    gaugeKeys,
    gaugemeister,
    gmData,
    refetchMany,
    sdkMut,
    signAndConfirmTX,
    signAndConfirmTXs,
    wrapTx,
  ]);
};
