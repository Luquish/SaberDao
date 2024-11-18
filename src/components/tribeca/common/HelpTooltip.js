import { MdInfoOutline } from "react-icons/md";
import React from "react";
import { MouseoverTooltip } from "./MouseoverTooltip";
export const HelpTooltip = ({ text, children }) => {
    return (React.createElement(MouseoverTooltip, { text: text },
        children,
        React.createElement(MdInfoOutline, { className: "inline w-3.5 h-3.5 ml-1.5 hover:text-primary" })));
};
