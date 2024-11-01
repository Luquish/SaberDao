import type { PublicKey } from "@solana/web3.js";

import { useGokiTransactionData } from "../../../../../utils/parsers";
import { Card } from "../../../../common/governance/Card";
import { GokiInstructionInfo } from "./GokiInstructionInfo";

interface Props {
  address: PublicKey;
}

export const GokiTransactionInfo: React.FC<Props> = ({ address }: Props) => {
  const { data: account } = useGokiTransactionData(address);
  if (!account) {
    return <></>;
  }

  return (
    <Card title="Goki: Transaction Information">
      {account.account.instructions.map((ix, i) => {
        return <GokiInstructionInfo key={i} index={i} ix={ix} />;
      })}
    </Card>
  );
};
