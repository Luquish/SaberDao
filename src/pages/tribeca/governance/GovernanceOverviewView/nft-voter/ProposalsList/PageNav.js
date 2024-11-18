import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import React from 'react';
export const PageNav = (props) => {
    const { currentPage, setCurrentPage, numPages } = props;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "flex items-center justify-between px-7 py-3" },
            React.createElement("div", { className: "w-20" }, currentPage !== 0 ? (React.createElement("button", { className: "flex gap-2 relative justify-center items-center hover:text-primary-300 uppercase", onClick: () => setCurrentPage(currentPage - 1) },
                React.createElement(FaChevronLeft, null),
                "Prev")) : (React.createElement("div", null))),
            React.createElement("nav", { "aria-label": "Page navigation", className: "flex-grow" },
                React.createElement("ul", { className: "w-full justify-center flex gap-4 items-center" }, new Array(numPages).fill(null).map((_, i) => (React.createElement("li", { key: i },
                    React.createElement("button", { className: `transition-colors ${currentPage === i ? "text-primary-300" : ""}`, onClick: () => setCurrentPage(i) }, i + 1)))))),
            React.createElement("div", { className: "w-20 text-right" }, currentPage !== numPages - 1 ? (React.createElement("button", { className: "flex gap-2 relative justify-center items-center hover:text-primary-300 uppercase", onClick: () => setCurrentPage(currentPage + 1) },
                "Next",
                React.createElement(FaChevronRight, null))) : (React.createElement("div", null))))));
};
