import React from "react";

import { useEnvironment } from "../../utils/useEnvironment";
import { shortenAddress } from "../../utils/utils";
import { ExternalLink } from "./typography/ExternalLink";

interface Props {
  txSig: string;
  className?: string;
  children?: React.ReactNode;
  full?: boolean;
}

export const TXLink: React.FC<Props> = ({
  txSig,
  className,
  children,
  full,
}: Props) => {
  const { network } = useEnvironment();
  return (
    <ExternalLink
      className={className}
      tw="font-mono"
      href={`https://explorer.solana.com/tx/${txSig}?cluster=${
        network?.toString() ?? ""
      }`}
    >
      {children ?? (full ? txSig : shortenAddress(txSig))}
    </ExternalLink>
  );
};
