import { useGovernor } from "../../../../../hooks/tribeca/useGovernor";
import { formatSignificantDistance } from "../../../../../utils/format";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { Profile } from "../../../../common/governance/Profile";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { useVotersList } from "./useVotersList";
export const TopVotersCard = () => {
    const { path } = useGovernor();
    const { data: voters } = useVotersList();
    return (React.createElement(Card, { title: `Addresses by Voting Weight` }, voters && (React.createElement("div", { tw: "whitespace-nowrap overflow-x-auto" },
        React.createElement(TableCardBody, { head: React.createElement("tr", null,
                React.createElement("th", null, "Rank"),
                React.createElement("th", null, "Locked Balance"),
                React.createElement("th", null, "ve Weight"),
                React.createElement("th", null, "Lock Duration")) }, voters.voters.slice(0, 50).map((voter, i) => (React.createElement("tr", { key: voter.escrow.toString() },
            React.createElement("td", null,
                React.createElement("div", { tw: "flex items-center gap-4" },
                    React.createElement("div", { tw: "w-4" }, i + 1),
                    React.createElement(Profile, { address: voter.owner, href: `${path}/address/${voter.owner.toString()}` }))),
            React.createElement("td", null,
                React.createElement(TokenAmountDisplay, { amount: voter.amount })),
            React.createElement("td", null,
                React.createElement(TokenAmountDisplay, { amount: voter.latestPower })),
            React.createElement("td", null, formatSignificantDistance(voter.escrowEndsAt, new Date()))))))))));
};
