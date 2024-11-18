import { extractErrorMessage } from "@rockooor/sail";
import React from "react";
export const ErrorMessage = ({ prefix, error }) => {
    const message = extractErrorMessage(error);
    return (React.createElement("div", { className: "text-red-500 text-sm px-3 py-2 border-accent-200" },
        React.createElement("span", null,
            prefix ? `${prefix}: ` : "",
            message ?? "Unknown error")));
};
