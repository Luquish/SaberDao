import { useTribecaRegistry } from "@/hooks/tribeca/api/useTribecaRegistry";
import GovernanceSummary from "./GovernanceSummary";
import React from "react";

const GovernanceListView: React.FC = () => {
  const { data: registry } = useTribecaRegistry();

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4 dark:text-gray-50">All DAOs</h1>
      {registry?.map((config) => (
        <GovernanceSummary key={config.address.toString()} config={config} />
      ))}
    </div>
  );
};

export default GovernanceListView;
