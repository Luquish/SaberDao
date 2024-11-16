import React from 'react';

import type { ProposalInfo } from "@/hooks/tribeca/useProposals";
import { Card } from "@/components/tribeca/common/governance/Card";
import { IXSummary } from "@/components/tribeca/common/governance/IXSummary";
import { TransactionPreviewLink } from "@/components/tribeca/common/governance/TransactionPreviewLink";
import { extractGitHubIssueURL, useGitHubIssue } from "./github";
import { ProposalBody } from "./ProposalBody";
import { GitHubComments } from "./ProposalBody/GitHubComments";

interface Props {
  className?: string;
  proposalInfo?: ProposalInfo | null;
}

export const ProposalDetails: React.FC<Props> = ({
  className,
  proposalInfo,
}: Props) => {
  const description = proposalInfo?.proposalMetaData?.descriptionLink ?? "";

  const issueURL = extractGitHubIssueURL(description);
  const { data: githubIssue } = useGitHubIssue(issueURL);

  return (
    <>
      <Card className={className} title="Details">
        <div>
          {proposalInfo?.proposalData.instructions.map((ix, i) => (
            <div key={i} className="px-7 py-5 border-b border-warmGray-800 flex">
              <div className="w-10 text-warmGray-600 font-medium">{i + 1}</div>
              <div className="text-white flex-1">
                <IXSummary instruction={ix} />
              </div>
            </div>
          ))}
        </div>
        <div className="p-7">
          {proposalInfo &&
            !proposalInfo.status.executed &&
            proposalInfo.proposalData.instructions.length > 0 && (
              <TransactionPreviewLink
                instructions={proposalInfo.proposalData.instructions}
              />
            )}
          <div className={!proposalInfo?.status.executed ? "mt-7" : ""}>
            <ProposalBody description={description} issue={githubIssue} />
          </div>
        </div>
      </Card>
      {githubIssue && <GitHubComments issue={githubIssue} />}
    </>
  );
};
