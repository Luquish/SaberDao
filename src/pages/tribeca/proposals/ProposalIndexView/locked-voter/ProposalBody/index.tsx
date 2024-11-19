import ReactMarkdown from "react-markdown";
import React from "react";

import { Prose } from "@/components/tribeca/common/typography/Prose";
import type { GitHubIssue } from "@/hooks/tribeca/github/useGitHubIssue";

interface Props {
  description: string;
  issue?: GitHubIssue | null;
}

const ProposalBody: React.FC<Props> = ({
  description,
  issue,
}: Props) => {
  return (
    <article>
      <Prose>
        {issue && (
          <div className="border-b border-b-gray-700 pb-8 mb-8">
            <ReactMarkdown>{issue.body ?? ""}</ReactMarkdown>
          </div>
        )}
        <ReactMarkdown>{description}</ReactMarkdown>
      </Prose>
    </article>
  );
};

export default ProposalBody;
