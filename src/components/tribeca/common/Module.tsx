import React from "react";

import { ErrorBoundary } from "@sentry/react";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const Module: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="px-4 py-6 md:p-12 rounded bg-white w-full shadow-2xl">
      <ErrorBoundary
        fallback={
          <p className="text-red-500">
            An error occurred while loading this component.
          </p>
        }
      >
        {children}
      </ErrorBoundary>
    </div>
  );
};
