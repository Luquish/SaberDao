import React from "react";
import { FaSearch } from "react-icons/fa";
export const InputSearchText = ({ value, onChange, placeholder, }) => {
    return (React.createElement("div", { className: "flex py-1.5 px-3 border border-gray-200 rounded m-0 transition-colors appearance-none\n          dark:(bg-gray-850 border-gray-700)\n          focus-within:(ring-primary-300 ring-1 bg-transparent)" },
        React.createElement("input", { value: value, onChange: onChange, placeholder: placeholder, className: "bg-transparent outline-none text-sm" }),
        React.createElement(FaSearch, { className: "w-3.5 h-3.5 my-auto text-secondary" })));
};
