import React from 'react';
import { Card } from "@/components/tribeca/common/governance/Card";
import { IXSummary } from "@/components/tribeca/common/governance/IXSummary";
import { TransactionPreviewLink } from "@/components/tribeca/common/governance/TransactionPreviewLink";
import { extractGitHubIssueURL, useGitHubIssue } from "./github";
import { ProposalBody } from "./ProposalBody";
import { GitHubComments } from "./ProposalBody/GitHubComments";
export const ProposalDetails = ({ className, proposalInfo, }) => {
    const description = proposalInfo?.proposalMetaData?.descriptionLink ?? "";
    const issueURL = extractGitHubIssueURL(description);
    const { data: githubIssue } = useGitHubIssue(issueURL);
    return (React.createElement(React.Fragment, null,
        React.createElement(Card, { className: className, title: "Details" },
            React.createElement("div", null, proposalInfo?.proposalData.instructions.map((ix, i) => (React.createElement("div", { key: i, className: "px-7 py-5 border-b border-warmGray-800 flex" },
                React.createElement("div", { className: "w-10 text-warmGray-600 font-medium" }, i + 1),
                React.createElement("div", { className: "text-white flex-1" },
                    React.createElement(IXSummary, { instruction: ix })))))),
            React.createElement("div", { className: "p-7" },
                proposalInfo &&
                    !proposalInfo.status.executed &&
                    proposalInfo.proposalData.instructions.length > 0 && (React.createElement(TransactionPreviewLink, { instructions: proposalInfo.proposalData.instructions })),
                React.createElement("div", { className: !proposalInfo?.status.executed ? "mt-7" : "" },
                    React.createElement(ProposalBody, { description: description, issue: githubIssue })))),
        githubIssue && React.createElement(GitHubComments, { issue: githubIssue })));
};
