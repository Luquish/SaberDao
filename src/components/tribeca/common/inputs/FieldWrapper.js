import React from "react";
export const FieldWrapper = ({ label, children, right, }) => {
    return (React.createElement("div", { className: "grid gap-3 grid-flow-row" },
        React.createElement("div", { className: "text-gray-300 text-sm w-full flex justify-between" },
            React.createElement("label", null, label),
            React.createElement("div", null, right)),
        React.createElement("div", null, children)));
};
