import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SailProvider } from "@rockooor/sail";
import { ThemeProvider } from "@emotion/react";
import { QuarryInterfaceProvider } from "@/contexts/quarry";
import { SDKProvider } from "@/contexts/sdk";
import { WalletConnectorProvider } from "@/contexts/wallet";
import { theme } from "@/theme";
import { onBeforeTxSend, onTxSend, onSailError } from "@/utils/governance/transactionHandlers";

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <WalletConnectorProvider>
          <SailProvider
            initialState={{
              batchDurationMs: 50,
              onBeforeTxSend,
              onTxSend,
              onSailError,
            }}
          >
            <QuarryInterfaceProvider>
              <SDKProvider>
                {children}
              </SDKProvider>
            </QuarryInterfaceProvider>
          </SailProvider>
        </WalletConnectorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}; 