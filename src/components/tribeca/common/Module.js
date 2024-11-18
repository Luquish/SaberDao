import React from "react";
import { ErrorBoundary } from "@sentry/react";
export const Module = ({ children }) => {
    return (React.createElement("div", { className: "px-4 py-6 md:p-12 rounded bg-white w-full shadow-2xl" },
        React.createElement(ErrorBoundary, { fallback: React.createElement("p", { className: "text-red-500" }, "An error occurred while loading this component.") }, children)));
};
