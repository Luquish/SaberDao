import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
  className?: string;
}
        
export const Box: React.FC<Props> = ({ title, children, className }: Props) => (
  <div className="border dark:border-warmGray-600 rounded text-sm">
    <h2 className="px-6 py-2 font-semibold text-gray-800 dark:text-gray-100">
      {title}
    </h2>
    <div
      className={`px-6 py-2 border-t border-t-gray-150 dark:border-t-warmGray-600 ${className || ''}`}
    >
      {children}
    </div>
  </div>
);
