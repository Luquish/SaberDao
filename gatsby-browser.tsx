import React from 'react';
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
import type { SailConfig } from "@rockooor/sail";

// Configuración de react-query
const queryClient = new QueryClient();

// Configuración de Sail con tipos
const sailConfig: SailConfig = {
  batchDurationMs: 50,
  onBeforeTxSend: ({ 
    network, 
    txs, 
    message 
  }: {
    network: string;
    txs: any[];
    message?: string;
  }) => {
    // Implementar lógica de onBeforeTxSend
  },
  onTxSend: ({ 
    network, 
    pending, 
    message 
  }: {
    network: string;
    pending: any[];
    message?: string;
  }) => {
    // Implementar lógica de onTxSend
  },
  onSailError: (err: Error) => {
    // Implementar manejo de errores
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
