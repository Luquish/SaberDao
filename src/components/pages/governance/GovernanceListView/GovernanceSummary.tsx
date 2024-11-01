import type { GovernorConfig } from "@tribecahq/registry";
import { Link } from "react-router-dom";

import { useGovernorVoters } from "../voters/AllVotersView/useVotersList";

interface Props {
  config: GovernorConfig;
}

export const GovernanceSummary: React.FC<Props> = ({ config }: Props) => {
  const { data: voters } = useGovernorVoters(config.address);

  return (
    <div tw="border border-warmGray-800 bg-warmGray-850 px-7 py-5 rounded">
      <div tw="flex flex-col gap-4">
        <div tw="flex items-center gap-4">
          <img
            src={config.iconURL}
            alt={`Icon of ${config.name}`}
            tw="w-8 h-8"
          />
          <h2 tw="text-xl font-bold text-white">
            <Link to={`/gov/${config.slug}`}>{config.name}</Link>
          </h2>
        </div>
        <p>{config.description}</p>
        <p>{voters?.count} Members</p>
        <p>
          {voters?.totalVotes.toLocaleString()} ve{config.govToken.symbol}
        </p>
      </div>
    </div>
  );
};
