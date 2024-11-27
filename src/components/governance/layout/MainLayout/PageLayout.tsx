import { ErrorBoundary } from "@sentry/react";
import type { ReactNode } from "react";
import React from "react";
import tw from "twin.macro";
import styled from "styled-components";

interface IProps {
  children: ReactNode | ReactNode[];
}

export const PageLayout: React.FC<IProps> = ({ children }: IProps) => {
  return (
    <PageContainer>
      <ErrorBoundary
        fallback={
          <ErrorMessage>
            An error occurred while loading this page.
          </ErrorMessage>
        }
      >
        {children}
      </ErrorBoundary>
    </PageContainer>
  );
};

const ErrorMessage = styled.p`
  ${tw`text-red-500`}
`;

const PageContainer = styled.div`
  ${tw`flex flex-col items-center mt-6 md:mt-12 w-full`}
`;
