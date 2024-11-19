import type { GovernorConfig } from "@tribecahq/registry";
import { Link } from "gatsby";
import React from "react";

import { useGovernorVoters } from "@/hooks/tribeca/useVotersList";

interface Props {
  config: GovernorConfig;
}

const GovernanceSummary: React.FC<Props> = ({ config }: Props) => {
  const { data: voters } = useGovernorVoters(config.address);

  return (
    <div className="border border-warmGray-800 bg-warmGray-850 px-7 py-5 rounded">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src={config.iconURL}
            alt={`Icon of ${config.name}`}
            className="w-8 h-8"
          />
          <h2 className="text-xl font-bold text-white">
            <Link
              to={`/tribeca/gov/${config.slug}`}
              className="hover:text-primary transition-colors"
            >
              {config.name}
            </Link>
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

export default GovernanceSummary;