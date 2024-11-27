import React, { Suspense } from "react";
import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SailProvider } from "@rockooor/sail";
import { ThemeProvider } from "@emotion/react";

import {
  GovernorProvider,
  useGovernorInfo,
} from "@/hooks/governance/useGovernor";
import { LoadingPage } from "@/components/governance/common/LoadingPage";
import { GovernorLayout } from "@/components/governance/layout/GovernorLayout";
import { GovernanceNotFoundPage } from "@/components/governance/pages/GovernanceNotFoundPage";
import { SDKProvider } from "@/contexts/sdk";
import { WalletConnectorProvider } from "@/contexts/wallet";
import { theme } from "@/theme";

import { onBeforeTxSend, onTxSend, onSailError } from "@/utils/governance/transactionHandlers";

const queryClient = new QueryClient();

const GovernanceContent: React.FC = () => {
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
    <GovernorLayout>
      <Suspense>
        <Outlet />
      </Suspense>
    </GovernorLayout>
  );
};

export const GovernanceView: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <WalletConnectorProvider>
          <SDKProvider>
            <SailProvider
              initialState={{
                batchDurationMs: 50,
                onBeforeTxSend,
                onTxSend,
                onSailError,
              }}
            >
              <GovernorProvider>
                <GovernanceContent />
              </GovernorProvider>
            </SailProvider>
          </SDKProvider>
        </WalletConnectorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default GovernanceView;