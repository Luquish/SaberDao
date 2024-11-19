import React from 'react';
import BaseContentLoader from 'react-content-loader';
import clsx from 'clsx';

interface ContentLoaderProps {
  children?: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

export default function ContentLoader({
  children,
  className,
  width = 200,
  height = 20,
  backgroundColor = "#f3f3f3",
  foregroundColor = "#ecebeb"
}: ContentLoaderProps) {
  return (
    <BaseContentLoader
      speed={2}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      className={clsx("animate-pulse", className)}
    >
      {children}
    </BaseContentLoader>
  );
};
