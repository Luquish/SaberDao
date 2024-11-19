import type { ReactNode } from "react";
import { useState } from "react";
import React from "react";

import { Tooltip } from "@/components/tribeca/common/MouseoverTooltip";

interface Props {
  content: ReactNode;
  children?: React.ReactNode;
  disableOnClick?: boolean;
}

const CustomTooltip = ({
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
          className="max-w-sm text-center"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <p className="whitespace-normal">{content}</p>
        </div>
      }
      placement="bottom"
    >
      <div className="flex items-center justify-center">
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

export default CustomTooltip;
