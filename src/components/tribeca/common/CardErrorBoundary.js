import { ErrorBoundary } from "@sentry/react";
import React from "react";
import { HelperCard } from "./HelperCard";
export const CardErrorBoundary = ({ children }) => {
    return (React.createElement(ErrorBoundary, { fallback: ({ error, eventId, componentStack }) => (React.createElement("div", { className: "py-7 px-4" },
            React.createElement(HelperCard, { variant: "error" },
                React.createElement("p", null,
                    "An unexpected error occurred: ",
                    error.message,
                    "."),
                React.createElement("p", null, "Please share the following information to help us debug this issue:"),
                React.createElement("p", null,
                    "Event ID: ",
                    eventId),
                React.createElement("pre", null, componentStack)))) }, children));
};
