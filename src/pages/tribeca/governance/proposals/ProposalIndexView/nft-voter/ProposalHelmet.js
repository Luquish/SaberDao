import { Helmet } from "react-helmet";
import { useCardinalName } from "@/hooks/cardinal/useAddressName";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { tsToDate } from "@/utils/utils";
export const ProposalHelmet = ({ proposalInfo }) => {
    const { daoName } = useGovernor();
    const { index } = proposalInfo;
    const cardinalName = useCardinalName(proposalInfo.proposalData.proposer);
    const author = cardinalName ?? proposalInfo.proposalData.proposer.toString();
    const twitterName = cardinalName?.startsWith("@") ? cardinalName : null;
    const title = proposalInfo?.proposalMetaData
        ? `${daoName ?? "Governance"} Proposal #${index}: ${proposalInfo.proposalMetaData.title}`
        : `${daoName ?? "Governance"} Proposal #${index}`;
    const description = proposalInfo.proposalMetaData
        ? proposalInfo.proposalMetaData.descriptionLink.slice(0, 200)
        : null;
    return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    React.createElement(Helmet, null,
        React.createElement("title", null,
            title,
            " | ",
            daoName),
        description && React.createElement("meta", { name: "description", content: description }),
        description && React.createElement("meta", { name: "og:description", content: description }),
        description && React.createElement("meta", { name: "twitter:description", content: description }),
        React.createElement("meta", { name: "og:title", content: title }),
        React.createElement("meta", { name: "og:type", content: "article" }),
        React.createElement("meta", { name: "og:article:published_time", content: tsToDate(proposalInfo.proposalData.createdAt).toISOString() }),
        author && React.createElement("meta", { name: "og:article:author", content: author }),
        React.createElement("meta", { name: "twitter:title", content: title }),
        twitterName && React.createElement("meta", { name: "twitter:creator", content: twitterName })));
};
