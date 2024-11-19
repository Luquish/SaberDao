import React from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';
import '@reach/dialog/styles.css';
import './src/styles/global.css';
import { ThemeProvider } from "@emotion/react";
import { SailProvider } from "@rockooor/sail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WalletConnectorProvider } from "./src/contexts/wallet";
import { QuarryInterfaceProvider } from "./src/contexts/quarry";
import { SDKProvider } from "./src/contexts/sdk";
import dapp from './src/hoc/dapp';
import { theme } from "./src/theme";
import { Network, PendingTransaction, TransactionEnvelope } from "@saberhq/solana-contrib";

// Configuración de react-query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            gcTime: 1000 * 60 * 60,
            retry: 5,
        },
    },
});

// Configuración de Sail con tipos explícitos
const sailConfig = {
    batchDurationMs: 50,
    onBeforeTxSend: ({ 
        bundleID,
        network, 
        txs,
        message 
    }: {
        bundleID: string;
        network: Network;
        txs: readonly TransactionEnvelope[];
        message?: string;
    }) => {
        console.log('Before TX Send:', { bundleID, network, txs, message });
    },
    onTxSend: ({ 
        bundleID,
        network, 
        txs,
        pending,
        message 
    }: {
        bundleID: string;
        network: Network;
        txs: readonly TransactionEnvelope[];
        pending: readonly PendingTransaction[];
        message?: string;
    }) => {
        console.log('TX Send:', { bundleID, network, txs, pending, message });
    },
    onSailError: (err: Error) => {
        console.error('Sail Error:', err);
    }
};

export const wrapPageElement = ({
    element,
    props,
}: {
    element: React.ReactElement;
    props: Record<string, unknown> & { location: Location };
}) => {
    const wrappedElement = (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider theme={theme}>
                <WalletConnectorProvider>
                    <SailProvider initialState={sailConfig}>
                        <QuarryInterfaceProvider>
                            <SDKProvider>
                                {element}
                            </SDKProvider>
                        </QuarryInterfaceProvider>
                    </SailProvider>
                </WalletConnectorProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );

    return dapp(wrappedElement, props);
};
