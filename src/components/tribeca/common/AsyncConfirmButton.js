import { useState } from "react";
import { AsyncButton } from "./AsyncButton";
import { Modal } from "./Modal";
import React from "react";
export const AsyncConfirmButton = ({ children, onClick, modal: { title, contents, disabled, style: modalStyle, innerStyles }, ...buttonProps }) => {
    const [showModal, setShowModal] = useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal, { className: `p-0 ${modalStyle || ''}`, isOpen: showModal, onDismiss: () => {
                setShowModal(false);
            } },
            React.createElement("div", { className: "border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4" }, title),
            React.createElement("div", { className: "p-8 flex flex-col items-center", css: innerStyles },
                contents,
                React.createElement(AsyncButton, { className: "mt-8 w-full", ...buttonProps, disabled: disabled, onClick: onClick }, title))),
        React.createElement(AsyncButton, { ...buttonProps, onClick: () => {
                setShowModal(true);
            } }, children)));
};
