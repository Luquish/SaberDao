// src/components/models/universal-popover.tsx
import React, { forwardRef, useState, useImperativeHandle, memo } from 'react';
import UniversalModal from './universal-modal';
const Modal = memo(({ children, onClose, open, setOpen }) => (React.createElement(UniversalModal, { onClose: onClose, open: open, setOpen: setOpen }, children)));
export default forwardRef(({ onClose, children }, ref) => {
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        close() {
            setOpen(false);
        },
        isOpened: open,
        open() {
            setOpen(true);
        },
    }));
    return (React.createElement(Modal, { onClose: onClose, open: open, setOpen: setOpen }, open ? children : null));
});
