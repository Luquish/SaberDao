import { ProposalState } from "@tribecahq/tribeca-sdk";
import Countdown from "react-countdown";
const STATE_LABELS = {
    [ProposalState.Active]: "Voting ends",
    [ProposalState.Draft]: "Created",
    [ProposalState.Canceled]: "Canceled",
    [ProposalState.Defeated]: "Failed",
    [ProposalState.Succeeded]: "Passed",
    [ProposalState.Queued]: "Queued",
};
export const stateToDateSeconds = (proposal, status) => {
    if (status.executed) {
        return status.executionTime;
    }
    switch (status.state) {
        case ProposalState.Active:
            return proposal.votingEndsAt;
        case ProposalState.Canceled:
            return null;
        case ProposalState.Defeated:
        case ProposalState.Succeeded:
            return proposal.votingEndsAt;
        case ProposalState.Draft:
            return proposal.createdAt;
        case ProposalState.Queued:
            return proposal.queuedAt;
    }
};
export const ProposalStateDate = ({ proposalInfo }) => {
    const { status, proposalData } = proposalInfo;
    const { executed, state } = status;
    const dateSeconds = stateToDateSeconds(proposalData, status);
    const date = dateSeconds ? new Date(dateSeconds.toNumber() * 1_000) : null;
    return (React.createElement("span", null,
        executed ? "Executed" : STATE_LABELS[state],
        " ",
        state === ProposalState.Active ? (date ? (React.createElement(React.Fragment, null,
            "in ",
            React.createElement(Countdown, { date: date }))) : ("--")) : (date?.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
        }))));
};
