import { AddGaugeCard } from "./AddGaugeCard";
import { GrantToEC } from "./GrantToEC";

export const GaugesTab: React.FC = () => {
  return (
    <div tw="flex flex-col gap-4">
      <GrantToEC />
      <AddGaugeCard />
    </div>
  );
};

export default GaugesTab;
