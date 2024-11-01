import formatDistance from "date-fns/formatDistance";

import { Card } from "../../../../../../common/governance/Card";
import { ProseSmall } from "../../../../../../common/typography/Prose";
import type { GitHubIssue } from "../github";
import { useGitHubIssueComments } from "../github";

interface Props {
  issue: GitHubIssue;
}

export const GitHubComments: React.FC<Props> = ({ issue }: Props) => {
  const { data: githubComments } = useGitHubIssueComments(issue.comments_url);
  return (
    <Card title={`Comments (${issue.comments})`} padded>
      <ProseSmall>
        <div tw="flex flex-col gap-4">
          {githubComments?.map((comment) => (
            <div key={comment.id} tw="flex gap-4 w-full">
              <img
                src={comment.user?.avatar_url ?? ""}
                tw="w-8 h-8 rounded-full"
                alt={`Profile of ${comment.user?.login ?? ""}`}
              />
              <div tw="border rounded-lg border-warmGray-700 flex-1">
                <div tw="px-4 py-2 bg-warmGray-800 border-b border-b-warmGray-700 rounded-t-lg">
                  <a
                    href={comment.user?.html_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {comment.user?.login}
                  </a>{" "}
                  <span tw="text-warmGray-400">
                    commented{" "}
                    {formatDistance(new Date(comment.created_at), new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div tw="px-5 py-3">{comment.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div tw="w-full text-center py-8">
          Got something to say? Add a comment to the{" "}
          <a href={issue.html_url} target="_blank" rel="noreferrer">
            proposal on GitHub
          </a>
          .
        </div>
      </ProseSmall>
    </Card>
  );
};
