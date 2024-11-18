import { fetchNullable } from "@rockooor/sail";
import { useQuery } from "@tanstack/react-query";
export const extractGitHubIssueURL = (body) => {
    const match = body.match(/\[View Discussion\]\(https:\/\/github.com\/(\w+)\/(\w+)\/issues\/(\d+)\)/);
    if (!match) {
        return null;
    }
    const [_, org, repo, issue] = match;
    if (!org || !repo || !issue) {
        return null;
    }
    return `https://api.github.com/repos/${org}/${repo}/issues/${issue}`;
};
export const useGitHubIssue = (issueURL) => {
    return useQuery({
        queryKey: ["githubIssue", issueURL],
        queryFn: async () => {
            if (!issueURL) {
                return null;
            }
            return await fetchNullable(issueURL);
        },
    });
};
export const useGitHubIssueComments = (commentsURL) => {
    return useQuery({
        queryKey: ["githubIssueComments", commentsURL],
        queryFn: async () => {
            if (!commentsURL) {
                return null;
            }
            return await fetchNullable(commentsURL);
        },
    });
};
