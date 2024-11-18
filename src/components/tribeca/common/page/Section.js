import React from "react";
export const BasicSection = ({ title, actions, description, children, }) => {
    return (React.createElement("div", null,
        React.createElement("div", { className: "mb-2" },
            actions ? (React.createElement("div", { className: "flex justify-between items-center" },
                React.createElement("h2", { className: "text-xl font-medium mb-1" }, title),
                actions)) : (React.createElement("h2", { className: "text-xl font-medium mb-1" }, title)),
            description && React.createElement("p", { className: "text-secondary text-sm" }, description)),
        children));
};
