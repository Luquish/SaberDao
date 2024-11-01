import { MdInfoOutline } from "react-icons/md";
import { css } from "twin.macro";

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
      tw="px-7 py-4 border-b border-warmGray-800"
      css={css`
        ${strech ? "flex: 1 1 0%" : ""}
      `}
    >
      <div tw="flex flex-row">
        <span tw="text-warmGray-400 text-sm">{label}</span>
        {tooltip && (
          <CustomTooltip content={tooltip}>
            <MdInfoOutline tw="ml-1 w-3.5" />
          </CustomTooltip>
        )}
      </div>
      <div tw="text-xl text-white mt-0.5">{children}</div>
    </div>
  );
};
