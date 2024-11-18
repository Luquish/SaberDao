import React, { useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import invariant from 'tiny-invariant';
import Navbar from '../components/Navbar';
import useNetwork from '../hooks/useNetwork';
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const CACHE_TIME = 1000 * 60 * 60;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            gcTime: CACHE_TIME,
            retry: 5,
        },
    },
});
const persister = createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : null,
});
require('@solana/wallet-adapter-react-ui/styles.css');
const Dapp = (props) => {
    const { network, endpoint, wsEndpoint } = useNetwork();
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
    ], [network]);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
    }, []);
    if (!ready) {
        return null;
    }
    invariant(endpoint);
    return (React.createElement(PersistQueryClientProvider, { client: queryClient, persistOptions: {
            persister,
            maxAge: CACHE_TIME,
            dehydrateOptions: {
                shouldDehydrateQuery: query => {
                    return ['swaps', 'pools', 'poolsData', 'prices', 'reserves', 'lpTokenAmounts', 'tokenList', 'rewardsList'].includes(query.queryKey[0]);
                },
            },
        } },
        React.createElement(ReactQueryDevtools, { initialIsOpen: false }),
        React.createElement(ConnectionProvider, { endpoint: endpoint, config: { wsEndpoint: wsEndpoint } },
            React.createElement(WalletProvider, { wallets: wallets, autoConnect: true },
                React.createElement(WalletModalProvider, null,
                    React.createElement("div", { className: "text-white min-h-screen w-full flex justify-center p-5" },
                        React.createElement("div", { className: "max-w-7xl flex flex-col w-full gap-5" },
                            React.createElement(Navbar, null),
                            props.children,
                            React.createElement(Footer, null))),
                    React.createElement(Toaster, { theme: "dark", position: "bottom-right", richColors: true }))))));
};
export default function dapp(WrappedComponent, props) {
    return React.createElement(Dapp, { ...props }, WrappedComponent);
}
