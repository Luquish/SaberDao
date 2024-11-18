import React from 'react';
export const Section = ({ title, description, className, children, }) => {
    return (React.createElement("section", null,
        React.createElement("h2", { className: "text-xl font-medium mb-1" }, title),
        description && React.createElement("p", { className: "text-secondary text-sm" }, description),
        React.createElement("div", { className: `my-6 flex items-center gap-4 ${className}` }, children)));
};
