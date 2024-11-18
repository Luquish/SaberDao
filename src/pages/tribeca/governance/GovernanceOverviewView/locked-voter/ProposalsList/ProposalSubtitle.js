import { ProposalStateDate } from "./ProposalStateDate";
import { ProposalStateLabel } from "./ProposalStateLabel";
export const ProposalSubtitle = ({ proposalInfo, className, }) => {
    const { state, executed } = proposalInfo.status;
    return (React.createElement("div", { tw: "flex items-center gap-2 mt-2", className: className },
        React.createElement(ProposalStateLabel, { state: state, executed: executed }),
        React.createElement("div", { tw: "flex gap-1 text-xs font-semibold" },
            React.createElement("span", null, `000${proposalInfo.index}`.slice(-4)),
            React.createElement("span", null, "\u00B7"),
            React.createElement(ProposalStateDate, { proposalInfo: proposalInfo }))));
};
