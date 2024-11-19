export function extractGitHubIssueURL(body: string): string | null {
  const match = body.match(
    /\[View Discussion\]\(https:\/\/github.com\/(\w+)\/(\w+)\/issues\/(\d+)\)/
  );
  if (!match) {
    return null;
  }
  const [_, org, repo, issue] = match;
  if (!org || !repo || !issue) {
    return null;
  }
  return `https://api.github.com/repos/${org}/${repo}/issues/${issue}`;
} 