import type { Placement } from "@popperjs/core";
import { animated, config, useTransition } from "@react-spring/web";
import React, { useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useOnClickOutside } from "@/utils/tribeca/onClickOutside";

const PopoverContainer = React.forwardRef<
  HTMLDivElement,
  { show: boolean; children?: React.ReactNode; style?: React.CSSProperties }
>(({ show, children, style }, ref) => (
  <div
    ref={ref}
    style={{
      zIndex: 10,
      transition: "visibility 150ms linear, opacity 150ms linear",
      ...style
    }}
    className="opacity-0 invisible"
  >
    {children}
  </div>
));

interface Props {
  onDismiss: () => void;
  show: boolean;
  target: Element | null;
  children: React.ReactNode;
  placement?: Placement;
}

export default function Drop({
  show,
  target,
  onDismiss,
  children,
  placement = "auto",
}: Props) {
  const popperElRef = useRef<HTMLDivElement | null>(null);
  const [popperElement, _setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  useOnClickOutside(popperElRef, show ? () => onDismiss() : undefined);

  const transition = useTransition(show, {
    from: { scale: 0.96, opacity: 1 },
    enter: { scale: 1, opacity: 1 },
    leave: { scale: 1, opacity: 0 },
    config: { ...config.default, duration: 100 },
  });

  const setPopperElement = useCallback((el: HTMLDivElement) => {
    popperElRef.current = el;
    _setPopperElement(el);
  }, []);

  const { styles, attributes } = usePopper(target, popperElement, {
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  // one container for positioning
  // one container for enter animation
  return (
    <PopoverContainer
      show={show}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      {transition(
        (springStyles, item) =>
          item && <animated.div style={springStyles}>{children}</animated.div>
      )}
    </PopoverContainer>
  );
};
