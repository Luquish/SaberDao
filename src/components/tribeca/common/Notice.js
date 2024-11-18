import React from "react";
export const Notice = ({ className, icon, title, children, }) => {
    return (React.createElement("div", { className: `border px-5 py-4 flex flex-col gap-3 ${className}` },
        title && (React.createElement("div", { className: "flex items-center gap-3" },
            icon && React.createElement("div", { className: "text-secondary" }, icon),
            React.createElement("h2", { className: "font-medium text-sm" }, title))),
        React.createElement("div", { className: "prose prose-sm" }, children)));
};
