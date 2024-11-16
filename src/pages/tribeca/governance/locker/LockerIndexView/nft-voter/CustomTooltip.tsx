import type { ReactNode } from "react";
import { useState } from "react";

import { Tooltip } from "../../../../../common/MouseoverTooltip";

interface Props {
  content: ReactNode;
  children?: React.ReactNode;
  disableOnClick?: boolean;
}

export const CustomTooltip = ({
  content,
  children,
  disableOnClick = false,
}: Props) => {
  const [show, setShow] = useState(false);

  return (
    <Tooltip
      show={show}
      text={
        <div
          tw="max-w-sm text-center"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <p tw="whitespace-normal">{content}</p>
        </div>
      }
      placement="bottom"
    >
      <div tw="flex items-center justify-center">
        <button
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          onClick={() => {
            if (disableOnClick) {
              setShow(false);
            }
          }}
          onKeyDown={() => {
            if (disableOnClick) {
              setShow(false);
            }
          }}
        >
          {children}
        </button>
      </div>
    </Tooltip>
  );
};
