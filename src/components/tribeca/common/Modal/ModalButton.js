import React, { useState } from "react";
import { Button } from "../Button";
import { Modal } from ".";
export const ModalButton = ({ buttonLabel, buttonProps, children, className, onDismiss, }) => {
    const [showModal, setShowModal] = useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(Modal, { isOpen: showModal, onDismiss: () => {
                onDismiss?.();
                setShowModal(false);
            }, className: `p-0 ${className || ''}` }, children),
        React.createElement(Button, { ...buttonProps, onClick: () => {
                setShowModal(true);
            } }, buttonLabel)));
};
