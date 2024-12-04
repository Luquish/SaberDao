import React from "react";
import { useGovernor } from "@/hooks/governance/useGovernor";

export const LoadingPage: React.FC = () => {
  const governorState = useGovernor();
  
  // Agregamos logs para ver el estado
  console.log("Loading Governor State:", governorState);

  return (
    <div tw="w-full min-h-[400px] flex items-center justify-center">
      <div tw="flex flex-col items-center gap-4">
        <div tw="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div tw="text-gray-400">
          <p>Loading governance data...</p>
          <pre tw="text-xs mt-2 text-gray-500">
            {JSON.stringify(governorState, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
