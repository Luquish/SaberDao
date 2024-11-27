import type { MessageSignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import React from "react";

import { SubscriptionCard } from "./SubscriptionCard";
import { SubscriptionPopover } from "./SubscriptionPopover";
import { WalletDisconnected } from "./WalletDisconnected";

interface Props {
  daoName: string;
  governor: string;
  walletPublicKey: string | null;
  signer: MessageSignerWalletAdapterProps | null;
}

const WalletDisconnectedPopover: React.FC = () => {
  return (
    <SubscriptionCard
      body={
        <div tw="w-full min-height[16rem] flex flex-col align-items[center] justify-content[center]">
          <WalletDisconnected tw="w-8 h-8" />
          <span tw="text-lg text-secondary text-align[center]">
            No wallet connected
          </span>
        </div>
      }
    />
  );
};

const WalletUnsupportedPopover: React.FC = () => {
  return (
    <SubscriptionCard
      body={
        <div tw="w-full min-height[16rem] flex flex-col align-items[center] justify-content[center]">
          <span tw="text-lg text-white text-align[center]">
            Unsupported wallet
          </span>
          <span tw="text-secondary text-align[center]">
            Supported wallets include Phantom, Solflare, and Slope
          </span>
        </div>
      }
    />
  );
};

export const SubscriptionPopoverContainer: React.FC<Props> = ({
  daoName,
  governor,
  walletPublicKey,
  signer,
}: Props) => {
  if (walletPublicKey === null) {
    return <WalletDisconnectedPopover />;
  }

  if (signer === null) {
    return <WalletUnsupportedPopover />;
  }

  return (
    <SubscriptionPopover
      daoName={daoName}
      governor={governor}
      walletPublicKey={walletPublicKey}
      signer={signer}
    />
  );
};
