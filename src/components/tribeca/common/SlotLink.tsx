import React from "react";

import { CURRENT_APP } from "../../../config";
import { useEnvironment } from "../../../utils/tribeca/useEnvironment";

interface Props {
  slot: number;
  className?: string;
  children?: React.ReactNode;
}

export const SlotLink: React.FC<Props> = ({
  slot,
  className,
  children,
}: Props) => {
  const { network } = useEnvironment();
  const isTribeca = CURRENT_APP === "tribeca";
  return (
    <a
      className={className}
      href={`https://explorer.solana.com/block/${slot}?cluster=${
        network?.toString() ?? ""
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children ?? slot.toLocaleString()}
    </a>
  );
};
