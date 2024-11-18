import { FaCheck, FaTimes } from "react-icons/fa";
import React from "react";

import { Alert } from "@/components/tribeca/common/Alert";
import { LoadingSpinner } from "@/components/tribeca/common/LoadingSpinner";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";

interface Props {
  title: string;
  description?: string;
  pass?: boolean;
  children?: React.ReactNode;
}

const ChecklistItem: React.FC<Props> = ({
  title,
  description,
  pass,
  children,
}: Props) => {
  return (
    <div className="px-7 py-4">
      <div className="flex flex-row justify-between">
        <th>
          <span className="text-white font-semibold">{title}</span>
          <span className="text-warmGray-600 font-normal text-xs">
            {description}
          </span>
        </th>
        <td>
          {pass ? (
            <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center">
              <FaCheck className="h-3 w-3" />
            </div>
          ) : pass === undefined ? (
            <LoadingSpinner className="h-6 w-6" />
          ) : (
            <div className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
              <FaTimes className="h-3 w-3" />
            </div>
          )}
        </td>
      </div>
      {pass === false && (
        <Alert className="mt-4 text-white">
          <ProseSmall>{children}</ProseSmall>
        </Alert>
      )}
    </div>
  );
};

export default ChecklistItem;