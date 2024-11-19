import React from "react";

import Card from "@/components/tribeca/common/governance/Card";

interface Props {
  className?: string;
}

const EscrowInfo: React.FC<Props> = ({ className }: Props) => {
  return <Card className={className} title="Voting Wallet"></Card>;
};

export default EscrowInfo;