import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
export const LoadingPage = ({ className }) => {
    return (React.createElement("div", { className: `flex items-center justify-center ${className}` },
        React.createElement(LoadingSpinner, null)));
};
