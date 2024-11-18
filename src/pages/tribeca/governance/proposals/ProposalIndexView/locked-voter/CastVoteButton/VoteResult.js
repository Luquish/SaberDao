import { VoteSide } from "@tribecahq/tribeca-sdk";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Button } from "@/common/Button";
import { ModalInner } from "@/common/Modal/ModalInner";
import { VOTE_SIDE_LABEL } from "../VotesCard";
const formatTweet = ({ daoName, proposal, side, reason, }) => [
    `I ${side !== VoteSide.Abstain
        ? `voted ${VOTE_SIDE_LABEL[side].toLowerCase()}`
        : `abstained from voting on`} ${daoName} Proposal #${proposal.index}${proposal.proposalMetaData?.title
        ? `: ${proposal.proposalMetaData.title}`
        : ""}`,
    reason,
    `Vote here: ${window.location.href}`,
]
    .filter((s) => !!s)
    .join("\n\n");
export const VoteResult = ({ proposalInfo, side, reason, }) => {
    const { daoName } = useGovernor();
    return (React.createElement(ModalInner, { title: "Vote Confirmed", tw: "px-6 max-w-md" },
        React.createElement("div", { tw: "flex flex-col items-center" },
            React.createElement("div", { tw: "text-center max-w-sm flex flex-col items-center gap-3" },
                React.createElement("h2", { tw: "text-white font-semibold text-xl leading-loose" },
                    "You",
                    " ",
                    side !== VoteSide.Abstain
                        ? `voted ${VOTE_SIDE_LABEL[side].toLowerCase()}`
                        : `abstained from voting on`,
                    React.createElement("br", null),
                    proposalInfo.proposalMetaData?.title ??
                        `Proposal #${proposalInfo.index}`),
                React.createElement("p", { tw: "text-sm leading-loose text-warmGray-400" },
                    "Help spread the word for your",
                    React.createElement("br", null),
                    "choice to win the vote:")),
            React.createElement("div", { tw: "mt-8" }, daoName && (React.createElement("a", { target: "_blank", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(formatTweet({
                    daoName,
                    proposal: proposalInfo,
                    side,
                    reason,
                }))}`, rel: "noreferrer" },
                React.createElement(Button, { variant: "primary", size: "md" },
                    "Tweet your ",
                    side === VoteSide.For ? "support" : "stance")))))));
};
