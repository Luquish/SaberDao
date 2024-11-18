import { Card } from "./Card";
import React from "react";
export const CardWithImage = ({ title, children, image, }) => {
    return (React.createElement(Card, null,
        React.createElement("div", { className: "flex flex-col md:flex-row" },
            React.createElement("div", { className: "flex-1 p-6" },
                React.createElement("h4", { className: "text-base font-bold mb-3.5 text-white" }, title),
                children),
            React.createElement("div", { className: "flex-1 md:w-1/2 bg-warmGray-900" }, image))));
};
