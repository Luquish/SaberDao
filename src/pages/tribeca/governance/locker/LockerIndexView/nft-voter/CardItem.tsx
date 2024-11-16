import { MdInfoOutline } from "react-icons/md";
import React from 'react';

import { CustomTooltip } from "./CustomTooltip";

interface Props {
  label: string;
  children?: React.ReactNode;
  tooltip?: string;
  strech?: boolean;
}

export const CardItem: React.FC<Props> = ({
  label,
  children,
  tooltip,
  strech = false,
}: Props) => {
  return (
    <div
      className={`px-7 py-4 border-b border-warmGray-800 ${
        strech ? "flex-1 flex-shrink-0 flex-grow" : ""
      }`}
    >
      <div className="flex flex-row">
        <span className="text-warmGray-400 text-sm">{label}</span>
        {tooltip && (
          <CustomTooltip content={tooltip}>
            <MdInfoOutline className="ml-1 w-3.5" />
          </CustomTooltip>
        )}
      </div>
      <div className="text-xl text-white mt-0.5">{children}</div>
    </div>
  );
};
