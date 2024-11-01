import ReactMarkdown from "react-markdown";

import { Prose } from "../../../../../../common/typography/Prose";
import type { GitHubIssue } from "../github";

interface Props {
  description: string;
  issue?: GitHubIssue | null;
}

export const ProposalBody: React.FC<Props> = ({
  description,
  issue,
}: Props) => {
  return (
    <article>
      <Prose>
        {issue && (
          <div tw="border-b border-b-gray-700 pb-8 mb-8">
            <ReactMarkdown linkTarget="_blank">
              {issue.body ?? ""}
            </ReactMarkdown>
          </div>
        )}
        <ReactMarkdown linkTarget="_blank">{description}</ReactMarkdown>
      </Prose>
    </article>
  );
};
