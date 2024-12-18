import React, { Suspense } from "react";

import Header from "./Header";
import PageLayout from "./PageLayout";

interface Props {
  children?: React.ReactNode;
}

export default function MainLayoutInner({ children }: Props) {
  return (
    <div className="relative">
      <div className="w-11/12 mx-auto">
        <Header />
      </div>
      <PageLayout>
        <Suspense>{children}</Suspense>
      </PageLayout>
    </div>
  );
}
