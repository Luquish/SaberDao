import tw from "twin.macro";

import { useGovernor } from "../../../../../../hooks/tribeca/useGovernor";
import { Card } from "../../../../../common/governance/Card";
import { GaugeList } from "../GaugeList";

/**
 * TODO: add a tree map of all gauges.
 * @returns
 */
export const AllGaugesPreview: React.FC = () => {
  const { path } = useGovernor();
  return (
    <Card
      titleStyles={tw`flex items-center justify-between`}
      title="All Gauges"
      link={{
        title: "View all gauges",
        href: `${path}/gauges/all`,
      }}
    >
      <div tw="whitespace-nowrap overflow-x-auto">
        <GaugeList limit={3} />
      </div>
    </Card>
  );
};
