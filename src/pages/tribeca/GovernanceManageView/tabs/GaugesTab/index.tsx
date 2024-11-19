import AddGaugeCard from "./AddGaugeCard";
import GrantToEC from "./GrantToEC";
import React from "react";

const GaugesTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <GrantToEC />
      <AddGaugeCard />
    </div>
  );
};

export default GaugesTab;
