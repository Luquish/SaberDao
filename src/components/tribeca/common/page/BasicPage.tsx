import { ErrorBoundary } from "@sentry/react";
import React from "react";
interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function BasicPage({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="w-full pb-8 px-4">
      <div className="w-full max-w-2xl mx-auto mt-16">
        <div>
          <h1 className="text-2xl font-medium mb-1">{title}</h1>
          {description && (
            <p className="text-secondary text-sm font-medium">{description}</p>
          )}
        </div>
        <div className="border-b w-full bg-gray-100 my-6" />
        <ErrorBoundary
          fallback={
            <p className="text-red-500">An error occurred while loading this page.</p>
          }
        >
          {children ?? <div />}
        </ErrorBoundary>
      </div>
    </div>
  );
};