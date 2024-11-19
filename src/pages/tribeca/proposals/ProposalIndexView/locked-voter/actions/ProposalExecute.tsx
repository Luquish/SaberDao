import { useTXHandlers } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import { TransactionInstruction } from "@solana/web3.js";
import pluralize from "pluralize";
import Countdown from "react-countdown";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import invariant from "tiny-invariant";

import { useSDK } from "@/contexts/sdk";
import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import type { ProposalInfo } from "@/hooks/tribeca/useProposals";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { useGokiTransactionData } from "@/utils/tribeca/parsers";
import { gokiTXLink, tsToDate } from "@/utils/tribeca/utils";
import { AsyncConfirmButton } from "@/components/tribeca/common/AsyncConfirmButton";
import Card from "@/components/tribeca/common/governance/Card";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
import ExecuteProposalButton from "@/pages/tribeca/GovernanceManageView/tabs/ExecutiveCouncilTab/ExecuteProposalButton";
import EmbedTX from "@/pages/tribeca/proposals/ProposalIndexView/locked-voter/EmbedTX";

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

const ProposalExecute: React.FC<Props> = ({
  proposal,
  onActivate,
}: Props) => {
  const { governorW, smartWallet, path, manifest } = useGovernor();
  const emergencyDAO = manifest?.addresses?.["emergency-dao"]?.address;
  const { sdkMut } = useSDK();
  const { wrapTx } = useWrapTx();
  const { ecWallet, isMemberOfEC } = useExecutiveCouncil();
  const { data: gokiTransactionData } = useGokiTransactionData(
    proposal.proposalData.queuedTransaction
  );
  const { signAndConfirmTX } = useTXHandlers();

  if (!gokiTransactionData) {
    return <></>;
  }

  const votingEndedAt = tsToDate(proposal.proposalData.queuedAt);
  const eta = tsToDate(gokiTransactionData.account.eta);
  const gracePeriodEnd = mapSome(ecWallet.data, (d) =>
    !gokiTransactionData.account.eta.isNeg()
      ? tsToDate(gokiTransactionData.account.eta.add(d.account.gracePeriod))
      : null
  );

  const etaSurpassed = eta <= new Date();
  const gracePeriodSurpassed = mapSome(gracePeriodEnd, (g) => g <= new Date());

  return (
    <Card title="Execute Proposal">
      <div className="px-7 py-4 text-sm">
        <ProseSmall>
          <p className="mb-4">
            The proposal was queued on{" "}
            <span className="text-white">
              {votingEndedAt.toLocaleString(undefined, {
                timeZoneName: "short",
              })}
            </span>
            .
          </p>
          {gracePeriodSurpassed ? (
            <p>
              The proposal execution period expired on{" "}
              {gracePeriodEnd?.toLocaleString(undefined, {
                timeZoneName: "short",
              })}
              . This proposal may no longer be executed by the Executive
              Council.
            </p>
          ) : etaSurpassed ? (
            <p>
              It may now be executed by any member of the{" "}
              <Link 
                to={`/tribeca${path}/details`}
                className="text-primary hover:text-white transition-colors"
              >
                Executive Council
              </Link>{" "}
              at any time before{" "}
              {gracePeriodEnd?.toLocaleString(undefined, {
                timeZoneName: "short",
              })}
              .
            </p>
          ) : (
            <p>
              It may be executed by any member of the{" "}
              <Link 
                to={`/tribeca${path}/details`}
                className="text-primary hover:text-white transition-colors"
              >
                Executive Council
              </Link>{" "}
              in{" "}
              <Countdown date={eta} />.
            </p>
          )}
          <ExternalLink
            className="mb-4"
            href={gokiTXLink(gokiTransactionData.account)}
          >
            View on Goki
          </ExternalLink>
        </ProseSmall>
        {isMemberOfEC && (
          <div className="flex justify-center items-center mt-8">
            {gracePeriodSurpassed && emergencyDAO && (
              <AsyncConfirmButton
                modal={{
                  title: "Revive Proposal via Emergency DAO",
                  contents: (
                    <div className="prose prose-light prose-sm">
                      <p>
                        You are about to propose the following{" "}
                        {pluralize(
                          "instruction",
                          gokiTransactionData.account.instructions.length
                        )}{" "}
                        on behalf of the emergency DAO:
                      </p>
                      <div>
                        <EmbedTX txKey={gokiTransactionData.publicKey} />
                      </div>
                    </div>
                  ),
                }}
                disabled={!governorW || !ecWallet.data || !etaSurpassed}
                className="w-3/4"
                variant="primary"
                onClick={async () => {
                  invariant(
                    governorW && sdkMut && smartWallet && ecWallet.data
                  );

                  const daoWallet = await sdkMut.loadSmartWallet(smartWallet);
                  const emergencyDAOWallet = await sdkMut.loadSmartWallet(
                    emergencyDAO
                  );

                  const { tx: innerTx } = await daoWallet.newTransaction({
                    proposer: emergencyDAOWallet.key,
                    instructions: proposal.proposalData.instructions.map(
                      (ix) =>
                        new TransactionInstruction({
                          ...ix,
                          data: Buffer.from(ix.data)
                        })
                    ),
                  });
                  const { tx } = await emergencyDAOWallet.newTransaction({
                    instructions: innerTx.instructions,
                  });
                  invariant(tx.instructions[0]);
                  await signAndConfirmTX(await wrapTx(tx), `Revive Proposal`);
                }}
              >
                {!etaSurpassed ? (
                  <>
                    <span className="mr-1">ETA in</span>
                    <Countdown date={eta} />
                  </>
                ) : (
                  "Revive Proposal via Emergency DAO"
                )}
              </AsyncConfirmButton>
            )}
            <ExecuteProposalButton
              tx={gokiTransactionData}
              onActivate={onActivate}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProposalExecute;
