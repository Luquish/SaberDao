import type { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import React from 'react';

import { useEscrow } from "@/hooks/tribeca/useEscrow";
import type { RowProps } from "@/components/tribeca/common/card/TableCard";
import { TableCard } from "@/components/tribeca/common/card/TableCard";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { Card } from "@/components/tribeca/common/governance/Card";
import { UserGauge } from "../../gauges/GaugesIndexView/UserGauges/UserGauge";
import type { UserGaugeInfo } from "../../gauges/hooks/useMyGauges";
import { useVoterGauges } from "../../gauges/hooks/useMyGauges";

interface Props {
  voterKey: PublicKey;
}

const generateKey = (g: UserGaugeInfo) => g.key.toString();

export const VoterInner: React.FC<Props> = ({ voterKey }: Props) => {
  const { escrowKey } = useEscrow(voterKey);
  const { myGauges } = useVoterGauges(escrowKey);

  const Row = useMemo(() => {
    const UserGaugeRow = ({
      item: gaugeVote,
      isLast,
    }: RowProps<UserGaugeInfo>) => (
      <UserGauge
        className={!isLast ? "border-b border-b-warmGray-800" : ""}
        owner={voterKey}
        gaugeVote={gaugeVote}
      />
    );
    return UserGaugeRow;
  }, [voterKey]);

  return (
    <Card title="Gauge Votes">
      <div className="text-sm w-full whitespace-nowrap overflow-x-auto">
        <TableCard
          head={
            <tr>
              <th>Gauge</th>
              <th>Votes</th>
              <th>Weight</th>
            </tr>
          }
          generateKey={generateKey}
          items={myGauges}
          rowLoader={
            <tr>
              <td>
                <ContentLoader className="w-20 h-4" />
              </td>
              <td>
                <ContentLoader className="w-16 h-4" />
              </td>
              <td>
                <ContentLoader className="w-8 h-4" />
              </td>
            </tr>
          }
          emptyStateMessage="This member has not voted on gauges."
          Row={Row}
        />
      </div>
    </Card>
  );
};
