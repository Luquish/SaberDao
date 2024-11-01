import React, { Suspense } from "react";
import tw, { styled } from "twin.macro";

import { Header } from "./Header";
import { PageLayout } from "./PageLayout";

interface Props {
  children?: React.ReactNode;
}

export const MainLayoutInner: React.FC<Props> = ({ children }: Props) => {
  return (
    <PageWrapper>
      <div tw="w-11/12 mx-auto">
        <Header />
      </div>
      <PageLayout>
        <Suspense>{children}</Suspense>
      </PageLayout>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  ${tw`relative`}
`;
