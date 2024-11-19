import React from "react";

import Card from "@/components/tribeca/common/governance/Card";

interface Props {
  className?: string;
}

const LockupDetails: React.FC<Props> = ({ className }: Props) => {
  return <Card className={className} />;
};

export default LockupDetails;
