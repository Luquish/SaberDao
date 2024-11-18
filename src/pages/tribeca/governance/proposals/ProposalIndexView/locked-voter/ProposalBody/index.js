import ReactMarkdown from "react-markdown";
import { Prose } from "@/common/typography/Prose";
export const ProposalBody = ({ description, issue, }) => {
    return (React.createElement("article", null,
        React.createElement(Prose, null,
            issue && (React.createElement("div", { tw: "border-b border-b-gray-700 pb-8 mb-8" },
                React.createElement(ReactMarkdown, { linkTarget: "_blank" }, issue.body ?? ""))),
            React.createElement(ReactMarkdown, { linkTarget: "_blank" }, description))));
};
