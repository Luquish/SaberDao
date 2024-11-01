import { DEFAULT_NETWORK_CONFIG_MAP } from "@saberhq/solana-contrib";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import copyToClipboard from "copy-to-clipboard";
import React from "react";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa";

import { notify } from "../../../../../utils/notifications";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { Button } from "../../../../common/Button";
import { Profile } from "../../../../common/governance/Profile";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";

interface Props {
  close?: () => void;
}

export const AccountPopover: React.FC<Props> = ({ close }: Props) => {
  const { network } = useEnvironment();
  const { publicKey } = useWallet();
  if (!publicKey) {
    return null;
  }

  return (
    <div tw="w-screen max-w-[378px]">
      <div tw="w-11/12 md:w-full bg-white rounded-lg border dark:(bg-warmGray-850 border-warmGray-800)">
        <div tw="flex items-center justify-between p-7 border-b dark:border-warmGray-800">
          <div tw="grid gap-2 text-base">
            <div tw="flex items-center">
              <Profile address={publicKey} />
            </div>
            <span tw="text-secondary">
              {DEFAULT_NETWORK_CONFIG_MAP[network].name}
            </span>
          </div>
          <div tw="flex gap-3">
            <MouseoverTooltip text="Copy Address">
              <Button
                variant="muted"
                icon
                onClick={() => {
                  copyToClipboard(publicKey.toString());
                  close?.();
                  notify({ message: "Address copied to clipboard." });
                }}
              >
                <FaCopy />
              </Button>
            </MouseoverTooltip>
            <MouseoverTooltip text="View on Explorer">
              <a
                href={`https://explorer.solana.com/address/${publicKey.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="muted" icon>
                  <FaExternalLinkAlt />
                </Button>
              </a>
            </MouseoverTooltip>
          </div>
        </div>
        <WalletDisconnectButton />
      </div>
    </div>
  );
};
