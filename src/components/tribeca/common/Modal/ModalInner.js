import React from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "../Button";
import { useModal } from "./context";
export const ModalInner = ({ title, children, buttonProps, className, }) => {
    const { close } = useModal();
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "relative border-b dark:border-b-warmGray-800 dark:text-white font-bold text-base text-center py-4" },
            React.createElement("div", { className: "px-8 overflow-ellipsis overflow-hidden whitespace-nowrap" }, title),
            React.createElement("button", { onClick: () => close(), className: "absolute right-4 h-full flex items-center top-0 text-warmGray-600 hover:text-warmGray-200 transition-colors" },
                React.createElement(FaTimes, null))),
        React.createElement("div", { className: `p-8 ${className ?? ''}` },
            children,
            buttonProps && React.createElement(Button, { className: "mt-8 w-full h-10", ...buttonProps }))));
};
