import React from 'react';
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { Card } from "@/components/tribeca/common/governance/Card";
import { GaugeList } from "../GaugeList";
/**
 * TODO: add a tree map of all gauges.
 * @returns
 */
export const AllGaugesPreview = () => {
    const { path } = useGovernor();
    return (React.createElement(Card, { className: "flex items-center justify-between", title: "All Gauges", link: {
            title: "View all gauges",
            href: `${path}/gauges/all`,
        } },
        React.createElement("div", { className: "whitespace-nowrap overflow-x-auto" },
            React.createElement(GaugeList, { limit: 3 }))));
};
