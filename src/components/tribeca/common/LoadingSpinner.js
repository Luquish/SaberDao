import React from 'react';
export function LoadingSpinner({ className }) {
    return (React.createElement("div", { className: `animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ${className}` }));
}
