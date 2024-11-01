import {
  findEpochGaugeVoterAddress,
  findGaugeVoteAddress,
  findGaugeVoterAddress,
  GAUGE_CODERS,
  GaugeSDK,
} from "@quarryprotocol/gauge";
import { useSail, useTXHandlers } from "@rockooor/sail";
import type { PublicKey } from "@saberhq/solana-contrib";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { findEscrowAddress } from "@tribecahq/tribeca-sdk";
import { useCallback } from "react";
import invariant from "tiny-invariant";

import { useProvider } from "../../../../../hooks/useProvider";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { useGMData } from "./useGaugemeister";
import { useAllGauges } from "./useGauges";

export const useCommitVotes = (escrowOwner?: PublicKey) => {
  const { gaugeKeys } = useAllGauges();
  const { providerMut } = useProvider();
  const owner = escrowOwner ?? providerMut?.wallet?.publicKey;
  const { refetchMany } = useSail();
  const { signAndConfirmTX, signAndConfirmTXs } = useTXHandlers();
  const { data: gmData } = useGMData();
  const { wrapTx } = useWrapTx();

  return useCallback(async () => {
    invariant(providerMut && gaugeKeys && gmData && owner);
    const gauge = GaugeSDK.load({ provider: providerMut });

    const [escrow] = await findEscrowAddress(gmData.account.locker, owner);
    const [gaugeVoter] = await findGaugeVoterAddress(gmData.publicKey, escrow);
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
              gaugemeister: gmData.publicKey,
              owner,
            })
          ),
          "Reset committed votes"
        );
      }
    } else {
      await signAndConfirmTX(
        await wrapTx(
          await gauge.gauge.prepareEpochGaugeVoter({
            gaugemeister: gmData.publicKey,
            owner,
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
      gaugemeister: gmData.publicKey,
      gauges: gaugesToCommit,
      owner,
    });
    await signAndConfirmTXs(
      await wrapTx(TransactionEnvelope.pack(...voteTXs)),
      "Commit votes"
    );
  }, [
    gaugeKeys,
    gmData,
    signAndConfirmTX,
    signAndConfirmTXs,
    owner,
    providerMut,
    refetchMany,
    wrapTx,
  ]);
};
