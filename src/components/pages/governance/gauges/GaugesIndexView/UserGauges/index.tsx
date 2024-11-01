import {
  findEpochGaugeVoterAddress,
  findGaugeVoterAddress,
} from "@quarryprotocol/gauge";
import { ZERO } from "@quarryprotocol/quarry-sdk";
import { useQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { FaExclamationTriangle } from "react-icons/fa";
import invariant from "tiny-invariant";
import tw from "twin.macro";

import { useSDK } from "../../../../../../contexts/sdk";
import { useUserEscrow } from "../../../../../../hooks/tribeca/useEscrow";
import { useGovernor } from "../../../../../../hooks/tribeca/useGovernor";
import {
  useEpochGaugeVoterData,
  useGaugeVoterData,
} from "../../../../../../utils/parsers";
import { TableCardBody } from "../../../../../common/card/TableCardBody";
import {
  EmptyState,
  EmptyStateConnectWallet,
} from "../../../../../common/EmptyState";
import { Card } from "../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { ModalButton } from "../../../../../common/Modal/ModalButton";
import { MouseoverTooltip } from "../../../../../common/MouseoverTooltip";
import { LockupTooShortTooltip } from "../../GaugesSetupView/lockupTooShortTooltip";
import { useGaugemeister, useGMData } from "../../hooks/useGaugemeister";
import { useMyGauges } from "../../hooks/useMyGauges";
import { SyncModal } from "./SyncModal";
import { UserGauge } from "./UserGauge";

const NUM_GAUGES_TO_DISPLAY = 3;

export const UserGauges: React.FC = () => {
  const { path } = useGovernor();
  const { sdkMut } = useSDK();
  const { myGauges, hasNoGauges, gaugeVotes } = useMyGauges();

  const gaugemeister = useGaugemeister();
  const { data: gmData } = useGMData();
  const { escrow, escrowKey } = useUserEscrow();
  const votingEpoch = gmData ? gmData.account.currentRewardsEpoch + 1 : null;
  const { data: epochGaugeVoterKey } = useQuery({
    queryKey: ["epochGaugeVoterKey", votingEpoch],
    queryFn: async () => {
      invariant(votingEpoch && gaugemeister && escrowKey);
      const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrowKey);
      const [epochGaugeVoter] = await findEpochGaugeVoterAddress(
        gaugeVoter,
        votingEpoch
      );
      return { gaugeVoter, epochGaugeVoter };
    },
    enabled: !!(votingEpoch !== null && escrowKey && gaugemeister),
  });
  const { data: gaugeVoter } = useGaugeVoterData(
    epochGaugeVoterKey?.gaugeVoter
  );
  const { data: epochGaugeVoter } = useEpochGaugeVoterData(
    epochGaugeVoterKey?.epochGaugeVoter
  );

  const expectedPower =
    gmData && escrow
      ? escrow.calculateVotingPower(gmData.account.nextEpochStartsAt.toNumber())
      : null;
  const isVotesChanged =
    gaugeVoter &&
    epochGaugeVoter &&
    expectedPower &&
    !expectedPower
      .sub(epochGaugeVoter.account.allocatedPower)
      .abs()
      // rounding error can be up to the number of gauges
      .lt(new BN(myGauges?.length ?? 0));

  const isDirty =
    gaugeVoter &&
    (!epochGaugeVoter ||
      !gaugeVoter.account.weightChangeSeqno.eq(
        epochGaugeVoter.account.weightChangeSeqno
      ));

  const showSyncButton = isVotesChanged || isDirty;

  const lockupTooShort = escrow?.escrow.escrowEndsAt.lt(
    gmData?.account.nextEpochStartsAt ?? ZERO
  );

  return (
    <Card
      titleStyles={tw`flex items-center justify-between`}
      title={
        <>
          <div tw="flex">
            <span>Your Gauge Votes</span>
            {lockupTooShort && <LockupTooShortTooltip />}
          </div>
          {showSyncButton && (
            <div>
              <ModalButton
                buttonLabel={"Sync"}
                buttonProps={{
                  variant: "outline",
                }}
              >
                <SyncModal />
              </ModalButton>
            </div>
          )}
        </>
      }
      link={
        sdkMut
          ? {
              title: `${
                hasNoGauges
                  ? "Cast Votes"
                  : (myGauges?.length ?? 0) > NUM_GAUGES_TO_DISPLAY
                  ? "View All Votes"
                  : "Edit Gauge Votes"
              }`,
              href: `${path}/gauges/weights`,
            }
          : undefined
      }
    >
      {!sdkMut ? (
        <EmptyStateConnectWallet title="Connect your wallet to vote on gauges." />
      ) : gaugeVotes === undefined ? (
        <div tw="flex h-[195px] w-full justify-center items-center">
          <LoadingPage />
        </div>
      ) : hasNoGauges ? (
        <EmptyState title="You haven't voted on any gauges yet." />
      ) : (
        <div tw="text-sm w-full whitespace-nowrap overflow-x-auto">
          <TableCardBody
            head={
              <tr>
                <th>Gauge</th>
                <th>
                  {isDirty || isVotesChanged ? (
                    <div tw="flex items-center gap-2">
                      <span>Your Votes</span>
                      <MouseoverTooltip
                        text={
                          isDirty
                            ? "Your votes have yet to be committed. Please click the 'Sync' button to the right."
                            : "Your voting escrow balance has changed. Please click the 'Sync' button to the right to maximize your voting power."
                        }
                      >
                        <FaExclamationTriangle tw="text-yellow-500" />
                      </MouseoverTooltip>
                    </div>
                  ) : (
                    <>Your Votes</>
                  )}
                </th>
                <th>Weight</th>
              </tr>
            }
          >
            {!myGauges || myGauges.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div tw="flex h-[195px] w-full justify-center items-center">
                    <LoadingPage />
                  </div>
                </td>
              </tr>
            ) : (
              myGauges
                ?.slice(0, NUM_GAUGES_TO_DISPLAY)
                .filter((gv) => gv.weight !== 0)
                .map((gaugeVote, i) => (
                  <UserGauge
                    css={[
                      i !== myGauges.length - 1 &&
                        tw`border-b border-b-warmGray-800`,
                    ]}
                    key={gaugeVote.key.toString()}
                    gaugeVote={gaugeVote}
                  />
                ))
            )}
            {myGauges && myGauges.length > NUM_GAUGES_TO_DISPLAY && (
              <tr>
                <td />
                <td>{myGauges.length - NUM_GAUGES_TO_DISPLAY} more ... </td>
                <td />
              </tr>
            )}
          </TableCardBody>
        </div>
      )}
    </Card>
  );
};
