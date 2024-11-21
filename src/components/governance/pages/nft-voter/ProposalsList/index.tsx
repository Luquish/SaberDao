import React, { useState } from "react";
import { ProposalState } from "@tribecahq/tribeca-sdk";
import { Link } from "gatsby";

import { useGovernor } from "@/src/hooks/governance/useGovernor";
import { useProposals } from "@/src/hooks/governance/useProposals";
import { EmptyState } from "@/src/components/governance/EmptyState";
import { PageNav } from "./PageNav";
import { PlaceholderCard } from "./PlaceholderCard";
import { ProposalCard } from "./ProposalCard";

const NUM_PLACEHOLDERS = 0;
const PROPOSALS_PER_PAGE = 20;

interface Props {
  maxCount?: number;
  showDrafts?: boolean;
}

export const ProposalsList: React.FC<Props> = ({
  maxCount = 9_999_999,
  showDrafts = false,
}: Props) => {
  const { path, proposalCount } = useGovernor();
  const proposals = useProposals();
  const [currentPage, setCurrentPage] = useState(0);

  const allProposals = [
    ...proposals,
    ...new Array<null>(NUM_PLACEHOLDERS).fill(null),
  ]
    .filter((p) => {
      const proposalState = p?.data?.status.state;
      return showDrafts
        ? true
        : proposalState !== ProposalState.Draft &&
        proposalState !== ProposalState.Canceled;
    })
    .slice(0, maxCount);

  const startCursor = currentPage * PROPOSALS_PER_PAGE;

  if (typeof proposalCount !== "number") {
    return (
      <>
        {Array(Math.min(PROPOSALS_PER_PAGE, maxCount))
          .fill(null)
          .map((_, i) => (
            <PlaceholderCard key={i} />
          ))}
      </>
    );
  }

  if (proposalCount === 0 || allProposals.length === 0) {
    return (
      <div>
        <EmptyState title="There aren't any proposals yet.">
          <Link
            className="text-primary hover:text-white transition-colors"
            to={`${path}/proposals/create`}
          >
            Create a proposal
          </Link>
        </EmptyState>
      </div>
    );
  }

  const pageCount = calcPageTotal(allProposals.length ?? 0);
  return (
    <>
      {allProposals
        .slice(startCursor, startCursor + PROPOSALS_PER_PAGE)
        .map((proposal, i) =>
          proposal && proposal.data ? (
            <ProposalCard
              key={proposal.data.proposalKey.toString()}
              proposalInfo={proposal.data}
            />
          ) : (
            <PlaceholderCard key={i} />
          )
        )}
      {pageCount > 1 && (
        <PageNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numPages={pageCount}
        />
      )}
    </>
  );
};

const calcPageTotal = (numProposals: number): number => {
  const div = Math.floor(numProposals / PROPOSALS_PER_PAGE);
  return div + (numProposals % PROPOSALS_PER_PAGE ? 1 : 0);
};
