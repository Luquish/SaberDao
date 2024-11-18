import { Suspense } from "react";
import { Outlet } from "react-router";
import React from "react";

import {
  GovernorProvider,
  useGovernorInfo,
} from "@/hooks/tribeca/useGovernor";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
import { GovernorLayout } from "@/components/tribeca/layout/GovernorLayout";
import { GovernanceNotFoundPage } from "./GovernanceNotFoundPage";

export const GovernanceView: React.FC = () => {
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
          <Outlet />
        </Suspense>
      </GovernorLayout>
    </GovernorProvider>
  );
};

export default GovernanceView;
