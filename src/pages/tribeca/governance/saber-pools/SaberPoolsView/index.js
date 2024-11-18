import { useSaberSwaps } from "../../../../../hooks/saber/useSaberSwaps";
import { useGovernor, useGovWindowTitle, } from "../../../../../hooks/tribeca/useGovernor";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
export const SaberPoolsView = () => {
    const { data: swaps } = useSaberSwaps();
    const { path } = useGovernor();
    useGovWindowTitle(`All Pools`);
    return (React.createElement(GovernancePage, { title: "All Saber Pools", backLink: {
            label: "Overview",
            href: path,
        } },
        React.createElement("div", { tw: "flex flex-col gap-8" },
            React.createElement(Card, { title: `All Pools (${swaps?.length ?? "Loading..."})` },
                React.createElement(TableCardBody, { head: React.createElement("tr", null,
                        React.createElement("th", null, "ID"),
                        React.createElement("th", null, "Name")) }, swaps
                    ?.filter((swap) => swap.isVerified)
                    .map((swap) => (React.createElement("tr", { key: swap.id },
                    React.createElement("td", null, swap.id),
                    React.createElement("td", null, swap.name)))))))));
};
export default SaberPoolsView;
