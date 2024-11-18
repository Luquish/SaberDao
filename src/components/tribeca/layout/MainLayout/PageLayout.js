import { ErrorBoundary } from "@sentry/react";
import React from "react";
export const PageLayout = ({ children }) => {
    return (React.createElement("div", { className: "flex flex-col items-center mt-6 md:mt-12 w-full" },
        React.createElement(ErrorBoundary, { fallback: React.createElement("div", { className: "text-red-500" }, "An error occurred while loading this page.") }, children)));
};
