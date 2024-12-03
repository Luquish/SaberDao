import React, { Suspense } from "react";
import { Outlet } from "react-router";
import { Router } from "@reach/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SailProvider } from "@rockooor/sail";
import { ThemeProvider } from "@emotion/react";

import {
  GovernorProvider,
  useGovernorInfo,
} from "@/hooks/governance/useGovernor";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QuarryInterfaceProvider } from "@/contexts/quarry";
import { LoadingPage } from "@/components/governance/common/LoadingPage";
import { GovernorLayout } from "@/components/governance/layout/GovernorLayout";
import { GovernanceNotFoundPage } from "@/components/governance/pages/GovernanceNotFoundPage";
import { SDKProvider } from "@/contexts/sdk";
import { WalletConnectorProvider } from "@/contexts/wallet";
import { theme } from "@/theme";

import { onBeforeTxSend, onTxSend, onSailError } from "@/utils/governance/transactionHandlers";

const queryClient = new QueryClient();
interface RouteComponentProps {
    path?: string;
}

const GovernanceContent: React.FC<RouteComponentProps> = () => {
    const info = useGovernorInfo();
    if (info?.loading) {
      return (
        <div tw="flex h-full justify-center items-center">
          <LoadingPage />
        </div>
      );
    }
    if (!info) {
      return (
        <GovernorLayout placeholder={true}>
          <GovernanceNotFoundPage />
        </GovernorLayout>
      );
    }
  
    return (
      <GovernorProvider>
        <GovernorLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </GovernorLayout>
      </GovernorProvider>
    );
};

export const GovernanceView: React.FC = () => {
  return (
   <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
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
                  <Router basepath="/governance">
                    <GovernanceContent />
                  </Router>
                </SDKProvider>
              </QuarryInterfaceProvider>
            </SailProvider>
          </WalletConnectorProvider>
        </ThemeProvider>
      </QueryClientProvider>
   </React.StrictMode>
  );
};

export default GovernanceView;