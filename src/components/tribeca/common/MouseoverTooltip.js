import React, { useCallback, useState } from "react";
import { Popover } from "./Popover";
export const Tooltip = ({ text, ...rest }) => {
    return (React.createElement(Popover, { content: React.createElement("div", { className: "py-2 px-4 text-sm text-white" }, text), ...rest }));
};
const TooltipContent = ({ content, ...rest }) => {
    return (React.createElement(Popover, { content: React.createElement("div", { className: "py-2 px-4 text-sm text-white" }, content), ...rest }));
};
export const MouseoverTooltip = ({ children, ...rest }) => {
    const [show, setShow] = useState(false);
    const open = useCallback(() => setShow(true), [setShow]);
    const close = useCallback(() => setShow(false), [setShow]);
    return (React.createElement(Tooltip, { ...rest, show: show },
        React.createElement("div", { onMouseEnter: open, onMouseLeave: close }, children)));
};
export const MouseoverTooltipContent = ({ content, children, ...rest }) => {
    const [show, setShow] = useState(false);
    const open = useCallback(() => setShow(true), [setShow]);
    const close = useCallback(() => setShow(false), [setShow]);
    return (React.createElement(TooltipContent, { ...rest, show: show, content: content },
        React.createElement("div", { className: "inline-block p-1", onMouseEnter: open, onMouseLeave: close }, children)));
};
