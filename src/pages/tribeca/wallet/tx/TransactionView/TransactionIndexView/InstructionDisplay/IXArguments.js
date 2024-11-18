import React from 'react';
import { Box } from "./Box";
export const IXArguments = ({ args }) => {
    return (React.createElement(Box, { title: `Arguments (${args.length})`, className: "p-0" }, args.map((arg, i) => {
        return (React.createElement("div", { key: `arg_${i}`, className: `px-6 py-2 flex border-t border-t-gray-150 dark:border-t-warmGray-600 gap-4 ${arg.type.includes("<")
                ? "flex-col items-start gap-2"
                : "items-center justify-between"}` },
            React.createElement("div", { className: "flex gap-4 flex-shrink-0" },
                React.createElement("span", { className: "text-gray-500 font-semibold" }, arg.name),
                React.createElement("code", { className: "text-gray-500 font-medium font-mono" }, arg.type)),
            React.createElement("div", { className: "text-gray-800 dark:text-white font-medium flex-shrink flex-wrap break-words" }, arg.data)));
    })));
};
