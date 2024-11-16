import React, { Suspense } from "react";
import { Outlet } from "react-router";

import { MainLayoutInner } from "./MainLayoutInner";

export const MainLayout: React.FC = () => {
  return (
    <MainLayoutInner>
      <Suspense>
        <Outlet />
      </Suspense>
    </MainLayoutInner>
  );
};
