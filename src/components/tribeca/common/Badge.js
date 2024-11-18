import React from "react";
export const Badge = ({ children, className = "", ...props }) => (React.createElement("span", { className: `bg-primary text-white px-2 py-0.5 rounded-md flex items-center justify-center ${className}`, ...props }, children));
