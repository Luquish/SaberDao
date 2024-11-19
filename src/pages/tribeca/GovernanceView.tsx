import { Suspense } from "react";
import React from "react";

import {
  GovernorProvider,
  useGovernorInfo,
} from "@/hooks/tribeca/useGovernor";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import { GovernorLayout } from "@/components/tribeca/layout/GovernorLayout";
import GovernanceNotFoundPage from "./GovernanceNotFoundPage";

const GovernanceView: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const info = useGovernorInfo();
  if (info?.loading) {
    return (
      <div className="flex h-full justify-center items-center">
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
          {children}
        </Suspense>
      </GovernorLayout>
    </GovernorProvider>
  );
};

export default GovernanceView;
