import type { PublicKey } from "@solana/web3.js";
import React from "react";

import { formatDurationSeconds } from "@/utils/tribeca/format";
import { useGaugemeisterData } from "@/utils/tribeca/parsers";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { Card } from "@/components/tribeca/common/governance/Card";

interface Props {
  gaugemeister: PublicKey;
}

const GaugesInfo: React.FC<Props> = ({ gaugemeister }: Props) => {
  const { data: gmData } = useGaugemeisterData(gaugemeister);
  return (
    <Card title="Gauges" className="pb-2">
      <AttributeList
        transformLabel={false}
        attributes={{
          Gaugemeister: gmData?.publicKey,
          Foreman: gmData?.account.foreman,
          Operator: gmData?.account.operator,
          Rewarder: gmData?.account.rewarder,
          "Epoch Duration": gmData
            ? formatDurationSeconds(gmData.account.epochDurationSeconds)
            : gmData,
        }}
      />
    </Card>
  );
};

export default GaugesInfo;
