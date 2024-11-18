import formatDistance from "date-fns/formatDistance";
import { Card } from "@/common/governance/Card";
import { ProseSmall } from "@/common/typography/Prose";
import { useGitHubIssueComments } from "../github";
export const GitHubComments = ({ issue }) => {
    const { data: githubComments } = useGitHubIssueComments(issue.comments_url);
    return (React.createElement(Card, { title: `Comments (${issue.comments})`, padded: true },
        React.createElement(ProseSmall, null,
            React.createElement("div", { tw: "flex flex-col gap-4" }, githubComments?.map((comment) => (React.createElement("div", { key: comment.id, tw: "flex gap-4 w-full" },
                React.createElement("img", { src: comment.user?.avatar_url ?? "", tw: "w-8 h-8 rounded-full", alt: `Profile of ${comment.user?.login ?? ""}` }),
                React.createElement("div", { tw: "border rounded-lg border-warmGray-700 flex-1" },
                    React.createElement("div", { tw: "px-4 py-2 bg-warmGray-800 border-b border-b-warmGray-700 rounded-t-lg" },
                        React.createElement("a", { href: comment.user?.html_url, target: "_blank", rel: "noreferrer" }, comment.user?.login),
                        " ",
                        React.createElement("span", { tw: "text-warmGray-400" },
                            "commented",
                            " ",
                            formatDistance(new Date(comment.created_at), new Date(), {
                                addSuffix: true,
                            }))),
                    React.createElement("div", { tw: "px-5 py-3" }, comment.body)))))),
            React.createElement("div", { tw: "w-full text-center py-8" },
                "Got something to say? Add a comment to the",
                " ",
                React.createElement("a", { href: issue.html_url, target: "_blank", rel: "noreferrer" }, "proposal on GitHub"),
                "."))));
};
