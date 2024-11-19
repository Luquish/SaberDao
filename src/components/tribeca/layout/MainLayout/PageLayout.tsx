import { ErrorBoundary } from "@sentry/react";
import type { ReactNode } from "react";
import React from "react";

interface IProps {
  children: ReactNode | ReactNode[];
}

export default function PageLayout({ children }: IProps) {
  return (
    <div className="flex flex-col items-center mt-6 md:mt-12 w-full">
      <ErrorBoundary
        fallback={
          <div className="text-red-500">
            An error occurred while loading this page.
          </div>
        }
      >
        {children}
      </ErrorBoundary>
    </div>
  );
}
