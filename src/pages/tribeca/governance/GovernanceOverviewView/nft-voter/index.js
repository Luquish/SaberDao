import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ImageWithFallback } from "../../../../common/ImageWithFallback";
import { MarinadeMigration } from "../../../../common/MarinadeMigration";
import { RecentProposals } from "./RecentProposals";
export const GovernanceOverviewView = () => {
    useGovWindowTitle(`Overview`);
    const { daoName, iconURL } = useGovernor();
    return (React.createElement(GovernancePage, { title: React.createElement("h1", { tw: "text-2xl md:text-3xl font-bold text-white tracking-tighter" },
            React.createElement("div", { tw: "flex items-center gap-2" },
                React.createElement(ImageWithFallback, { src: iconURL, size: 36, alt: `Icon for ${daoName ?? "DAO"}` }),
                React.createElement("span", null,
                    daoName,
                    " Governance"))), preContent: React.createElement(MarinadeMigration, null), hideDAOName: true },
        React.createElement(RecentProposals, null)));
};
