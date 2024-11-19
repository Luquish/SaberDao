import { useSail, useTXHandlers } from "@rockooor/sail";
import { sleep } from "@saberhq/token-utils";
import { useEffect, useMemo } from "react";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import invariant from "tiny-invariant";

import { useUserEscrow } from "@/hooks/tribeca/useEscrow";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import type { ProposalInfo } from "@/hooks/tribeca/useProposals";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { formatDurationSeconds } from "@/utils/tribeca/format";
import { Button } from "@/components/tribeca/common/Button";
import Card from "@/components/tribeca/common/governance/Card";
import LoadingPage from "@/components/tribeca/common/LoadingPage";

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

const ProposalActivate: React.FC<Props> = ({
  proposal,
  onActivate,
}: Props) => {
  const { minActivationThreshold, path, governorData } = useGovernor();
  const { data: escrow, veBalance, refetch } = useUserEscrow();
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
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
      <div className="px-7 py-4 text-sm">
        {!earliestActivationTime || !governorData ? (
          <LoadingPage />
        ) : earliestActivationTime > new Date() ? (
          <div className="flex flex-col gap-2">
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
          <div className="flex justify-center items-center">
            <Button
              disabled={!escrow}
              className="w-3/4 dark:text-white hover:dark:text-primary hover:dark:border-primary"
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
          <div className="flex flex-col gap-2">
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
            <Link 
              className="flex justify-center items-center" 
              to={`/tribeca${path}/locker`}
            >
              <Button className="w-3/4 mt-4">Lock Tokens</Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProposalActivate;
