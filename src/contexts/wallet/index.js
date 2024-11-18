// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import { ConnectionProvider, WalletProvider, } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, } from "@solana/wallet-adapter-wallets";
import React, { useMemo } from "react";
import { environments } from "../../utils/tribeca/environments";
import { EnvironmentProvider } from "../../utils/tribeca/useEnvironment";
const SOLE_NETWORKS = {
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
export const SOLE_NETWORK = SOLE_NETWORKS[window.location.hostname] ?? null;
export const WalletConnectorProvider = ({ children, }) => {
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new LedgerWalletAdapter(),
    ], 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [SOLE_NETWORKS[window.location.hostname]]);
    return (React.createElement(ConnectionProvider, { endpoint: environments[SOLE_NETWORKS[window.location.hostname] ?? "mainnet-beta"]
            .endpoint },
        React.createElement(WalletProvider, { wallets: wallets, autoConnect: true },
            React.createElement(WalletModalProvider, null,
                React.createElement(EnvironmentProvider, null, children)))));
};
