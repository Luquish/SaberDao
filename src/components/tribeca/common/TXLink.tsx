import React from "react";

import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import { shortenAddress } from "@/utils/tribeca/utils";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";

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
      href={`https://explorer.solana.com/tx/${txSig}?cluster=${
        network?.toString() ?? ""
      }`}
    >
      {children ?? (full ? txSig : shortenAddress(txSig))}
    </ExternalLink>
  );
};
