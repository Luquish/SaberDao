import { useMemo } from "react";
import React from 'react';
import { useEscrow } from "@/hooks/tribeca/useEscrow";
import { TableCard } from "@/components/tribeca/common/card/TableCard";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { Card } from "@/components/tribeca/common/governance/Card";
import { UserGauge } from "../../gauges/GaugesIndexView/UserGauges/UserGauge";
import { useVoterGauges } from "../../gauges/hooks/useMyGauges";
const generateKey = (g) => g.key.toString();
export const VoterInner = ({ voterKey }) => {
    const { escrowKey } = useEscrow(voterKey);
    const { myGauges } = useVoterGauges(escrowKey);
    const Row = useMemo(() => {
        const UserGaugeRow = ({ item: gaugeVote, isLast, }) => (React.createElement(UserGauge, { className: !isLast ? "border-b border-b-warmGray-800" : "", owner: voterKey, gaugeVote: gaugeVote }));
        return UserGaugeRow;
    }, [voterKey]);
    return (React.createElement(Card, { title: "Gauge Votes" },
        React.createElement("div", { className: "text-sm w-full whitespace-nowrap overflow-x-auto" },
            React.createElement(TableCard, { head: React.createElement("tr", null,
                    React.createElement("th", null, "Gauge"),
                    React.createElement("th", null, "Votes"),
                    React.createElement("th", null, "Weight")), generateKey: generateKey, items: myGauges, rowLoader: React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(ContentLoader, { className: "w-20 h-4" })),
                    React.createElement("td", null,
                        React.createElement(ContentLoader, { className: "w-16 h-4" })),
                    React.createElement("td", null,
                        React.createElement(ContentLoader, { className: "w-8 h-4" }))), emptyStateMessage: "This member has not voted on gauges.", Row: Row }))));
};
