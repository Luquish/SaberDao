import type { ReactNode } from "react";
import React, { useCallback, useState } from "react";

import type { PopoverProps } from "./Popover";
import { Popover } from "./Popover";

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: ReactNode;
}

interface TooltipContentProps extends Omit<PopoverProps, "content"> {
  content: ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, ...rest }) => {
  return (
    <Popover
      content={<div className="py-2 px-4 text-sm text-white">{text}</div>}
      {...rest}
    />
  );
};

const TooltipContent: React.FC<TooltipContentProps> = ({
  content,
  ...rest
}) => {
  return (
    <Popover
      content={<div className="py-2 px-4 text-sm text-white">{content}</div>}
      {...rest}
    />
  );
};

export const MouseoverTooltip: React.FC<Omit<TooltipProps, "show">> = ({
  children,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);

  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  );
};

export const MouseoverTooltipContent: React.FC<
  Omit<TooltipContentProps, "show">
> = ({ content, children, ...rest }) => {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <TooltipContent {...rest} show={show} content={content}>
      <div
        className="inline-block p-1"
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  );
};
