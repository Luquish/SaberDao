import React, { useCallback } from 'react';
import clsx from 'clsx';
export default ({ children, onClose, open, setOpen, title }) => {
    const handleClose = useCallback(() => {
        setOpen(false);
        if (onClose)
            onClose();
    }, [onClose, setOpen]);
    return (React.createElement("div", { className: clsx('fixed inset-0 flex items-center justify-center transition-colors z-10', open ? 'visible bg-[rgba(0,0,0,0.4)]' : 'invisible'), onClick: handleClose }, children));
};
