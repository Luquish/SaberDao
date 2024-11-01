// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

import type { Network } from "@saberhq/solana-contrib";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";

import { environments } from "../../utils/environments";
import { EnvironmentProvider } from "../../utils/useEnvironment";

interface Props {
  children: React.ReactNode;
}

const SOLE_NETWORKS: Record<string, Network> = {
  "dao.saber.so": "mainnet-beta",
  "goki.so": "mainnet-beta",
  "tribeca.so": "mainnet-beta",
  "anchor.so": "mainnet-beta",
  "testnet.anchor.so": "testnet",
  "devnet.anchor.so": "devnet",
  "devnet.goki.so": "devnet",
  "devnet.tribeca.so": "devnet",
};

/**
 * The only network for the app to display, if applicable.
 */
export const SOLE_NETWORK: Network | null =
  SOLE_NETWORKS[window.location.hostname] ?? null;

export const WalletConnectorProvider: React.FC<Props> = ({
  children,
}: Props) => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [SOLE_NETWORKS[window.location.hostname]]
  );

  return (
    <ConnectionProvider
      endpoint={
        environments[SOLE_NETWORKS[window.location.hostname] ?? "mainnet-beta"]
          .endpoint
      }
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <EnvironmentProvider>{children}</EnvironmentProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
