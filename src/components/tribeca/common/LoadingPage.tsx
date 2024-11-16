import React from "react";

import { LoadingSpinner } from "./LoadingSpinner";

interface Props {
  className?: string;
}

interface LoadingSpinnerProps {
    size?: number;
  }

export const LoadingPage: React.FC<Props> = ({ className }: Props) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoadingSpinner/>
    </div>
  );
};
