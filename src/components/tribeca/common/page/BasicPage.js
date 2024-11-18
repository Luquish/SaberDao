import { ErrorBoundary } from "@sentry/react";
import React from "react";
export const BasicPage = ({ title, description, children, }) => {
    return (React.createElement("div", { className: "w-full pb-8 px-4" },
        React.createElement("div", { className: "w-full max-w-2xl mx-auto mt-16" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-2xl font-medium mb-1" }, title),
                description && (React.createElement("p", { className: "text-secondary text-sm font-medium" }, description))),
            React.createElement("div", { className: "border-b w-full bg-gray-100 my-6" }),
            React.createElement(ErrorBoundary, { fallback: React.createElement("p", { className: "text-red-500" }, "An error occurred while loading this page.") }, children ?? React.createElement("div", null)))));
};
