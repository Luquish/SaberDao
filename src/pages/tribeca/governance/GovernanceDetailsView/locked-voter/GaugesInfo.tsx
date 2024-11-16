import type { PublicKey } from "@solana/web3.js";

import { formatDurationSeconds } from "../../../../../utils/format";
import { useGaugemeisterData } from "../../../../../utils/parsers";
import { AttributeList } from "../../../../common/AttributeList";
import { Card } from "../../../../common/governance/Card";

interface Props {
  gaugemeister: PublicKey;
}

export const GaugesInfo: React.FC<Props> = ({ gaugemeister }: Props) => {
  const { data: gmData } = useGaugemeisterData(gaugemeister);
  return (
    <Card title="Gauges" tw="pb-2">
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
