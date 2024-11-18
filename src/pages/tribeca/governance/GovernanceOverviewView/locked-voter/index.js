import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ImageWithFallback } from "../../../../common/ImageWithFallback";
import { ProgramsList } from "../../ProgramsView/ProgramsList";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "./RecentProposals";
export const GovernanceOverviewView = () => {
    useGovWindowTitle(`Overview`);
    const { daoName, iconURL, path } = useGovernor();
    return (React.createElement(GovernancePage, { title: React.createElement("h1", { tw: "text-2xl md:text-3xl font-bold text-white tracking-tighter" },
            React.createElement("div", { tw: "flex items-center gap-2" },
                React.createElement(ImageWithFallback, { src: iconURL, size: 36, alt: `Icon for ${daoName ?? "DAO"}` }),
                React.createElement("span", null,
                    daoName,
                    " Governance"))), preContent: React.createElement(OverviewHeader, null), hideDAOName: true },
        React.createElement(RecentProposals, null),
        React.createElement(Card, { tw: "mt-8", title: "Programs", link: {
                title: "View all programs",
                href: `${path}/programs`,
            } },
            React.createElement(ProgramsList, { maxCount: 3 }))));
};
