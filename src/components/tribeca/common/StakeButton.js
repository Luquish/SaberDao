import React from 'react';
import clsx from 'clsx';
export function StakeButton({ className, ...props }) {
    return (React.createElement("button", { className: clsx('py-1 rounded-xl text-2xl font-medium', 'w-[48px]', 'transform active:scale-95', 'bg-green-500 bg-opacity-10', 'text-green-500', 'hover:bg-opacity-20', 'transition-all duration-200', className), ...props }));
}
