import { ErrorBoundary } from "@sentry/react";

import { useConditionalDarkMode } from "../../../hooks/useConditionalDarkMode";
import { AnchorWidthContainer } from "./AnchorWidthContainer";
import { Navbar } from "./Navbar";

interface Props {
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  innerStyles?: React.CSSProperties;
}

export const AnchorLayout: React.FC<Props> = ({
  title,
  description,
  children,
  innerStyles,
}: Props) => {
  useConditionalDarkMode(true);
  return (
    <div tw="w-full">
      <Navbar />
      <AnchorWidthContainer tw="mt-16 pb-8 px-4" style={innerStyles}>
        {title && (
          <>
            <div>
              <h1 tw="text-white text-2xl font-bold mb-1">{title}</h1>
              {description && <p>{description}</p>}
            </div>
            <div tw="border-b w-full border-b-warmGray-800 my-6" />
          </>
        )}
        <ErrorBoundary
          fallback={
            <p tw="text-red-500">An error occurred while loading this page.</p>
          }
        >
          {children ?? <div />}
        </ErrorBoundary>
      </AnchorWidthContainer>
    </div>
  );
};
