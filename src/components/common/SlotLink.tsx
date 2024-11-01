import React from "react";
import tw from "twin.macro";

import { CURRENT_APP } from "../../config";
import { useEnvironment } from "../../utils/useEnvironment";

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
      css={[
        isTribeca && tw`text-white`,
        !isTribeca && tw`text-gray-800`,
        tw`hover:text-primary`,
      ]}
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
