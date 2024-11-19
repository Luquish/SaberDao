import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { fetchNullable } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";

export type GitHubIssue = RestEndpointMethodTypes["issues"]["get"]["response"]["data"];
export type GitHubComments = RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"];

export function useGitHubIssue(issueURL: string | null) {
  return useQuery({
    queryKey: ["githubIssue", issueURL],
    queryFn: async () => {
      if (!issueURL) {
        return null;
      }
      return await fetchNullable<GitHubIssue>(issueURL);
    },
  });
}

export function useGitHubIssueComments(commentsURL: string | null) {
  return useQuery({
    queryKey: ["githubIssueComments", commentsURL],
    queryFn: async () => {
      if (!commentsURL) {
        return null;
      }
      return await fetchNullable<GitHubComments>(commentsURL);
    },
  });
}