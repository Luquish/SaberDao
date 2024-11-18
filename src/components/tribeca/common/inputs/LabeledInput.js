import React from "react";
export const LabeledInput = ({ id, label, Component, error, touched, footer, ...commonProps }) => {
    return (React.createElement("label", { className: "flex flex-col gap-1", htmlFor: id },
        label && React.createElement("span", { className: "text-sm" }, label),
        React.createElement(Component, { ...commonProps, id: id, className: `${touched && error && "ring-1 ring-red-500"}` }),
        touched && error && React.createElement("span", { className: "text-red-500 text-sm" }, error),
        footer !== undefined && React.createElement("span", { className: "text-sm" }, footer)));
};
