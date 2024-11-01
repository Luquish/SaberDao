import { useSail, useTXHandlers } from "@rockooor/sail";
import { sleep } from "@saberhq/token-utils";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import invariant from "tiny-invariant";

import { useUserEscrow } from "../../../../../../../hooks/tribeca/useEscrow";
import { useGovernor } from "../../../../../../../hooks/tribeca/useGovernor";
import type { ProposalInfo } from "../../../../../../../hooks/tribeca/useProposals";
import { useWrapTx } from "../../../../../../../hooks/useWrapTx";
import { formatDurationSeconds } from "../../../../../../../utils/format";
import { Button } from "../../../../../../common/Button";
import { Card } from "../../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../../common/LoadingPage";

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalActivate: React.FC<Props> = ({
  proposal,
  onActivate,
}: Props) => {
  const { minActivationThreshold, path, governorData } = useGovernor();
  const { data: escrow, veBalance, refetch } = useUserEscrow();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const { governorW } = useGovernor();
  const { signAndConfirmTX } = useTXHandlers();

  const earliestActivationTime = useMemo(
    () =>
      governorData
        ? new Date(
            proposal.proposalData.createdAt
              .add(governorData.account.params.votingDelay)
              .toNumber() * 1_000
          )
        : null,
    [governorData, proposal.proposalData.createdAt]
  );

  useEffect(() => {
    if (!earliestActivationTime) {
      return;
    }
    const remainingTime = earliestActivationTime.getTime() - Date.now();
    const timeout = setTimeout(() => {
      void refetch();
    }, remainingTime + 1);
    return () => clearTimeout(timeout);
  }, [earliestActivationTime, refetch]);

  return (
    <Card title="Actions">
      <div tw="px-7 py-4 text-sm">
        {!earliestActivationTime || !governorData ? (
          <LoadingPage />
        ) : earliestActivationTime > new Date() ? (
          <div tw="flex flex-col gap-2">
            <p>
              You must wait{" "}
              {formatDurationSeconds(
                governorData.account.params.votingDelay.toNumber()
              )}{" "}
              for this proposal to be activated.
            </p>
            <p>
              The proposal may be activated at{" "}
              {earliestActivationTime?.toLocaleString(undefined, {
                timeZoneName: "short",
              })}{" "}
              by anyone who possesses at least{" "}
              {minActivationThreshold?.formatUnits()}.
            </p>
          </div>
        ) : minActivationThreshold &&
          veBalance?.greaterThan(minActivationThreshold) ? (
          <div tw="flex justify-center items-center">
            <Button
              disabled={!escrow}
              tw="w-3/4 dark:text-white hover:dark:text-primary hover:dark:border-primary"
              variant="outline"
              onClick={async () => {
                invariant(escrow);
                const tx = escrow.escrowW.activateProposal(
                  proposal.proposalKey
                );
                await signAndConfirmTX(await wrapTx(tx), "Activate Proposal");
                await sleep(1_000);
                await refetch();
                onActivate();
              }}
            >
              Activate Proposal
            </Button>
          </div>
        ) : (
          <div tw="flex flex-col gap-2">
            <p>
              You must have at least{" "}
              <strong>{minActivationThreshold?.formatUnits()}</strong> to
              activate this proposal for voting.
            </p>
            {veBalance ? (
              <p>You currently have {veBalance?.formatUnits()}.</p>
            ) : (
              <p>You currently don't have any tokens vote locked.</p>
            )}
            <Link tw="flex justify-center items-center" to={`${path}/locker`}>
              <Button tw="w-3/4 mt-4">Lock Tokens</Button>
            </Link>
          </div>
        )}
        <div tw="flex flex-col gap-2">
          {governorW &&
            proposal.proposalData.proposer.equals(
              governorW.provider.wallet.publicKey
            ) && (
              <div tw="flex justify-center items-center">
                <Button
                  variant="outline-danger"
                  tw="w-3/4 mt-4"
                  onClick={async () => {
                    const tx = governorW.cancelProposal({
                      proposal: proposal.proposalKey,
                    });
                    const handle = await handleTX(
                      await wrapTx(tx),
                      "Cancel Proposal"
                    );
                    if (!handle.pending) {
                      return;
                    }
                    await handle.pending.wait();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
        </div>
      </div>
    </Card>
  );
};
