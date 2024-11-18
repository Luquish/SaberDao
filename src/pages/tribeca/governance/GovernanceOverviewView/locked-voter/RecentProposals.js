import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { Card } from "../../../../common/governance/Card";
import { ProposalsList } from "./ProposalsList";
export const RecentProposals = () => {
    const { path } = useGovernor();
    return (React.createElement(Card, { title: "Recent Proposals", link: {
            title: "View all proposals",
            href: `${path}/proposals`,
        } },
        React.createElement(ProposalsList, { maxCount: 3 })));
};
