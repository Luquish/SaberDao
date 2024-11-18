import { ContentLoader } from "../ContentLoader";
import { EmptyState } from "../EmptyState";
import { TableCardBody } from "./TableCardBody";
import React from "react";
const defaultRowLoader = (React.createElement("tr", null,
    React.createElement("td", null,
        React.createElement(ContentLoader, null))));
export const TableCard = ({ items, rowLoader = defaultRowLoader, generateKey, emptyStateMessage = "There are no rows in this list.", children, Row, ...props }) => {
    return (React.createElement(TableCardBody, { ...props }, items === undefined ? (Array(3)
        .fill(null)
        .map(() => rowLoader)) : items.length === 0 ? (React.createElement("tr", null,
        React.createElement("td", { colSpan: 100 },
            React.createElement(EmptyState, { className: "w-full", title: emptyStateMessage })))) : Row ? (React.createElement(React.Fragment, null, items.map((item, i) => (React.createElement(Row, { key: generateKey(item), item: item, index: i, isLast: i === items.length - 1 }))))) : (children)));
};
