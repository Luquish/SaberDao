import React, { Suspense } from "react";
import MainLayoutInner from "./MainLayoutInner";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MainLayoutInner>
      <Suspense>
        {children}
      </Suspense>
    </MainLayoutInner>
  );
};

export default MainLayout;
