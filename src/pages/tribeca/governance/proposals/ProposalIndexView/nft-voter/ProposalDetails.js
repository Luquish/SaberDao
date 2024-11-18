import React from 'react';
import { Card } from "@/components/tribeca/common/governance/Card";
import { IXSummary } from "@/components/tribeca/common/governance/IXSummary";
import { TransactionPreviewLink } from "@/components/tribeca/common/governance/TransactionPreviewLink";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
export const ProposalDetails = ({ className, proposalInfo, }) => {
    const descriptionRaw = proposalInfo?.proposalMetaData?.descriptionLink ?? "";
    const description = descriptionRaw.substring(0, descriptionRaw.lastIndexOf("["));
    const discussionLink = descriptionRaw.substring(descriptionRaw.lastIndexOf("(") + 1, descriptionRaw.lastIndexOf(")"));
    return (React.createElement(Card, { className: className, title: "Details" },
        React.createElement("div", null, proposalInfo?.proposalData.instructions.map((ix, i) => (React.createElement("div", { key: i, className: "px-7 py-5 border-b border-warmGray-800 flex" },
            React.createElement("div", { className: "w-10 text-warmGray-600 font-medium" }, i + 1),
            React.createElement("div", { className: "text-white flex-1" },
                React.createElement(IXSummary, { instruction: ix })))))),
        React.createElement("div", { className: "p-7" },
            proposalInfo &&
                !proposalInfo.status.executed &&
                proposalInfo.proposalData.instructions.length > 0 && (React.createElement(TransactionPreviewLink, { instructions: proposalInfo.proposalData.instructions })),
            React.createElement("div", { className: !proposalInfo?.status.executed ? "mt-7" : "" },
                React.createElement("article", { className: "flex flex-col" },
                    React.createElement("span", null, description),
                    discussionLink && (React.createElement(ExternalLink, { className: "my-4 text-base", href: discussionLink }, "View Discussion")))))));
};
