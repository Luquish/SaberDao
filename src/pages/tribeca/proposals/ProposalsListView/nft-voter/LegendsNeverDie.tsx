import React from 'react';

import { useGovernor } from "@/hooks/tribeca/useGovernor";

interface LegendItemProps {
  children: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ children }) => {
  const getBeforeClasses = () => {
    const baseClasses = "before:content-[''] before:mr-2.5 before:w-1 before:h-3.5 before:inline-block before:align-[-25%] before:leading-none";
    
    if (children === "Active") {
      return `${baseClasses} before:bg-accent`;
    }
    if (children === "Passed") {
      return `${baseClasses} before:bg-primary`;
    }
    if (children === "Failed") {
      return `${baseClasses} before:bg-warmGray-600`;
    }
    
    return baseClasses;
  };

  return (
    <label className={getBeforeClasses()}>
      {children}
    </label>
  );
};

export const LegendsNeverDie: React.FC = () => {
  const { proposalCount } = useGovernor();
  return (
    <div className="bg-warmGray-800 p-5 flex gap-11 rounded">
      <div className="text-2xl text-white font-medium bg-coolGray-800 rounded-full h-20 w-20 flex items-center justify-center">
        {proposalCount?.toLocaleString()}
      </div>
      <legend className="flex flex-col gap-1 text-sm justify-center font-bold tracking-tight">
        <LegendItem>Active</LegendItem>
        <LegendItem>Passed</LegendItem>
        <LegendItem>Failed</LegendItem>
      </legend>
    </div>
  );
};
