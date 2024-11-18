import { ProposalState } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash-es";
import { FaCheck, FaDraftingCompass, FaHourglass, FaTimes, } from "react-icons/fa";
const STATE_LABELS = {
    [ProposalState.Active]: "active",
    [ProposalState.Draft]: "draft",
    [ProposalState.Canceled]: "canceled",
    [ProposalState.Defeated]: "failed",
    [ProposalState.Succeeded]: "passed",
    [ProposalState.Queued]: "queued",
};
const getStateIcon = (state) => {
    switch (state) {
        case ProposalState.Active:
            return (React.createElement("div", { tw: "bg-accent text-white h-6 w-6 rounded-full flex items-center justify-center" },
                React.createElement(FaHourglass, { tw: "h-3 w-3" })));
        case ProposalState.Canceled:
        case ProposalState.Defeated:
            return (React.createElement("div", { tw: "bg-gray-500 text-white h-6 w-6 rounded-full flex items-center justify-center" },
                React.createElement(FaTimes, { tw: "h-3 w-3" })));
        case ProposalState.Draft:
            return (React.createElement("div", { tw: "bg-gray-500 text-white h-6 w-6 rounded-full flex items-center justify-center" },
                React.createElement(FaDraftingCompass, { tw: "h-3 w-3" })));
        default:
            return (React.createElement("div", { tw: "bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center" },
                React.createElement(FaCheck, { tw: "h-3 w-3" })));
    }
};
export const ProposalStateBadge = ({ status }) => {
    const { executed, state } = status;
    return (React.createElement("div", { tw: "flex flex-col items-center gap-1 lg:(flex-row gap-5)" },
        getStateIcon(state),
        React.createElement("span", { tw: "text-xs md:text-sm text-white" }, startCase(executed ? "executed" : STATE_LABELS[state]))));
};
