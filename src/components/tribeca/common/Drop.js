import { animated, config, useTransition } from "@react-spring/web";
import React, { useCallback, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useOnClickOutside } from "../../../utils/tribeca/onClickOutside";
const PopoverContainer = React.forwardRef(({ show, children, style }, ref) => (React.createElement("div", { ref: ref, style: {
        zIndex: 10,
        transition: "visibility 150ms linear, opacity 150ms linear",
        ...style
    }, className: "opacity-0 invisible" }, children)));
export const Drop = ({ show, target, onDismiss, children, placement = "auto", }) => {
    const popperElRef = useRef(null);
    const [popperElement, _setPopperElement] = useState(null);
    useOnClickOutside(popperElRef, show ? () => onDismiss() : undefined);
    const transition = useTransition(show, {
        from: { scale: 0.96, opacity: 1 },
        enter: { scale: 1, opacity: 1 },
        leave: { scale: 1, opacity: 0 },
        config: { ...config.default, duration: 100 },
    });
    const setPopperElement = useCallback((el) => {
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
    return (React.createElement(PopoverContainer, { show: show, ref: setPopperElement, style: styles.popper, ...attributes.popper }, transition((springStyles, item) => item && React.createElement(animated.div, { style: springStyles }, children))));
};
