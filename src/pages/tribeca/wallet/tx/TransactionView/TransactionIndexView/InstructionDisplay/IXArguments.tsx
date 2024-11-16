import React from 'react';

import { Box } from "./Box";

interface Props {
  args: { name: string; type: string; data: string }[];
}

export const IXArguments: React.FC<Props> = ({ args }: Props) => {
  return (
    <Box title={`Arguments (${args.length})`} className="p-0">
      {args.map((arg, i) => {
        return (
          <div
            key={`arg_${i}`}
            className={`px-6 py-2 flex border-t border-t-gray-150 dark:border-t-warmGray-600 gap-4 ${
              arg.type.includes("<") 
                ? "flex-col items-start gap-2" 
                : "items-center justify-between"
            }`}
          >
            <div className="flex gap-4 flex-shrink-0">
              <span className="text-gray-500 font-semibold">{arg.name}</span>
              <code className="text-gray-500 font-medium font-mono">{arg.type}</code>
            </div>
            <div className="text-gray-800 dark:text-white font-medium flex-shrink flex-wrap break-words">
              {arg.data}
            </div>
          </div>
        );
      })}
    </Box>
  );
};
