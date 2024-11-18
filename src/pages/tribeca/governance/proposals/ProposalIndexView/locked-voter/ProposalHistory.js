import { ZERO } from "@quarryprotocol/quarry-sdk";
import { getProposalState, PROPOSAL_STATE_LABELS, ProposalState, } from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { startCase } from "lodash-es";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useGokiTransactionData } from "@/utils/tribeca/parsers";
import { Card } from "@/components/tribeca/common/governance/Card";
export const makeDate = (num) => new Date(num.toNumber() * 1_000);
const extractEvents = (proposalData, tx) => {
    const events = [];
    if (!proposalData.canceledAt.eq(ZERO)) {
        events.push({ title: "Canceled", date: makeDate(proposalData.canceledAt) });
    }
    if (!proposalData.activatedAt.eq(ZERO)) {
        events.push({
            title: "Activated",
            date: makeDate(proposalData.activatedAt),
        });
    }
    if (!proposalData.createdAt.eq(ZERO)) {
        events.push({ title: "Created", date: makeDate(proposalData.createdAt) });
    }
    if (!proposalData.queuedAt.eq(ZERO)) {
        events.push({
            title: "Queued",
            date: makeDate(proposalData.queuedAt),
            link: tx
                ? `https://goki.so/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
                : null,
        });
    }
    if (!proposalData.votingEndsAt.eq(ZERO) &&
        makeDate(proposalData.votingEndsAt) <= new Date()) {
        // TODO: update quorum
        const state = getProposalState({ proposalData });
        events.push({
            title: startCase(PROPOSAL_STATE_LABELS[state === ProposalState.Queued ? ProposalState.Succeeded : state]),
            date: makeDate(proposalData.votingEndsAt),
        });
    }
    if (tx?.account.executedAt.gt(new BN(0))) {
        events.push({
            title: "Executed",
            date: makeDate(tx.account.executedAt),
            link: tx
                ? `https://goki.so/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
                : null,
        });
    }
    return events.sort((a, b) => (a.date < b.date ? -1 : 1));
};
export const ProposalHistory = ({ className, proposalInfo, }) => {
    const { data: tx } = useGokiTransactionData(!proposalInfo?.proposalData.queuedAt.eq(ZERO)
        ? proposalInfo?.proposalData.queuedTransaction
        : null);
    const events = proposalInfo && tx ? extractEvents(proposalInfo.proposalData, tx) : [];
    return (React.createElement(Card, { className: className, title: "Proposal History" },
        React.createElement("div", { tw: "px-7 py-4 grid gap-4" }, events.map(({ title, date, link }, i) => (React.createElement("div", { key: i },
            React.createElement("div", { tw: "flex items-center justify-between" },
                React.createElement("div", { tw: "flex flex-col text-sm" },
                    React.createElement("span", { tw: "text-white" }, title),
                    React.createElement("span", { tw: "text-warmGray-600 text-xs" },
                        date.toLocaleDateString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        }),
                        " ",
                        "\u2014 ",
                        date.toLocaleTimeString())),
                link && (React.createElement("a", { href: link, tw: "text-primary hover:text-white transition-colors", target: "_blank", rel: "noreferrer" },
                    React.createElement(FaExternalLinkAlt, null))))))))));
};
