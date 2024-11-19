import React from "react";

import LoadingSpinner from "./LoadingSpinner";

interface Props {
  className?: string;
}

interface LoadingSpinnerProps {
    size?: number;
  }

export default function LoadingPage({ className }: Props) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoadingSpinner/>
    </div>
  );
};
