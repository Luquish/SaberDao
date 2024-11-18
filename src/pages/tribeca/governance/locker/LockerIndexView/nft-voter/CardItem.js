import { MdInfoOutline } from "react-icons/md";
import React from 'react';
import { CustomTooltip } from "./CustomTooltip";
export const CardItem = ({ label, children, tooltip, strech = false, }) => {
    return (React.createElement("div", { className: `px-7 py-4 border-b border-warmGray-800 ${strech ? "flex-1 flex-shrink-0 flex-grow" : ""}` },
        React.createElement("div", { className: "flex flex-row" },
            React.createElement("span", { className: "text-warmGray-400 text-sm" }, label),
            tooltip && (React.createElement(CustomTooltip, { content: tooltip },
                React.createElement(MdInfoOutline, { className: "ml-1 w-3.5" })))),
        React.createElement("div", { className: "text-xl text-white mt-0.5" }, children)));
};
