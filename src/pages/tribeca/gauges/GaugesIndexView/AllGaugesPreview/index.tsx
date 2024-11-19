import React from 'react';
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import Card from "@/components/tribeca/common/governance/Card";
import GaugeList from "@/pages/tribeca/gauges/GaugesIndexView/GaugeList";

/**
 * TODO: add a tree map of all gauges.
 * @returns
 */
const AllGaugesPreview: React.FC = () => {
  const { path } = useGovernor();
  return (
    <Card
      className="flex items-center justify-between"
      title="All Gauges"
      link={{
        title: "View all gauges",
        href: `${path}/gauges/all`,
      }}
    >
      <div className="whitespace-nowrap overflow-x-auto">
        <GaugeList limit={3} />
      </div>
    </Card>
  );
};

export default AllGaugesPreview;
