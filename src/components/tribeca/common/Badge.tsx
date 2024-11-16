import React from "react";

export const Badge: React.FC<React.HTMLProps<HTMLSpanElement>> = ({ children, className = "", ...props }) => (
    <span className={`bg-primary text-white px-2 py-0.5 rounded-md flex items-center justify-center ${className}`} {...props}>
      {children}
    </span>
  );