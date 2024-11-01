import { ErrorBoundary } from "@sentry/react";

import { HelperCard } from "./HelperCard";

interface Props {
  children?: React.ReactNode;
}

export const CardErrorBoundary: React.FC<Props> = ({ children }: Props) => {
  return (
    <ErrorBoundary
      fallback={({ error, eventId, componentStack }) => (
        <div tw="py-7 px-4">
          <HelperCard variant="error">
            <p>An unexpected error occurred: {error.message}.</p>
            <p>
              Please share the following information to help us debug this
              issue:
            </p>
            <p>Event ID: {eventId}</p>
            <pre>{componentStack}</pre>
          </HelperCard>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
