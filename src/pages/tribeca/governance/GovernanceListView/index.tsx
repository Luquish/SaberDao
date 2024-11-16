import { useTribecaRegistry } from "../../../../hooks/api/useTribecaRegistry";
import { GovernanceSummary } from "./GovernanceSummary";

export const GovernanceListView: React.FC = () => {
  const { data: registry } = useTribecaRegistry();

  return (
    <div>
      <h1 tw="font-bold text-3xl mb-4 dark:text-gray-50">All DAOs</h1>
      {registry?.map((config) => (
        <GovernanceSummary key={config.address.toString()} config={config} />
      ))}
    </div>
  );
};

export default GovernanceListView;
