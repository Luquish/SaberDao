import { FaCheck, FaTimes } from "react-icons/fa";

import { Alert } from "../../../../common/Alert";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { ProseSmall } from "../../../../common/typography/Prose";

interface Props {
  title: string;
  description?: string;
  pass?: boolean;
  children?: React.ReactNode;
}

export const ChecklistItem: React.FC<Props> = ({
  title,
  description,
  pass,
  children,
}: Props) => {
  return (
    <div tw="px-7 py-4">
      <div tw="flex flex-row justify-between">
        <th>
          <span tw="text-white font-semibold">{title}</span>
          <span tw="text-warmGray-600 font-normal text-xs">{description}</span>
        </th>
        <td>
          {pass ? (
            <div tw="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center">
              <FaCheck tw="h-3 w-3" />
            </div>
          ) : pass === undefined ? (
            <LoadingSpinner tw="h-6 w-6" />
          ) : (
            <div tw="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
              <FaTimes tw="h-3 w-3" />
            </div>
          )}
        </td>
      </div>
      {pass === false && (
        <Alert tw="mt-4 text-white">
          <ProseSmall>{children}</ProseSmall>
        </Alert>
      )}
    </div>
  );
};
