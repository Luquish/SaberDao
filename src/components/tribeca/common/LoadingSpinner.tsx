import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ${className}`} />
  );
}
