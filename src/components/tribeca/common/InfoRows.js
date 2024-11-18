import React from "react";
export const InfoRows = ({ rows }) => {
    return (React.createElement("div", { className: "grid gap-3" }, Object.entries(rows).map(([label, value]) => (React.createElement("div", { key: label, className: "text-xs flex items-start justify-between" },
        React.createElement("div", { className: "lowercase text-secondary" }, label),
        React.createElement("div", { className: "text-gray-800" }, value))))));
};
