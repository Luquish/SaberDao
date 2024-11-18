import React from "react";
import { Copyable } from "./Copyable";
export const HexData = ({ raw }) => {
    if (!raw || raw.length === 0) {
        return React.createElement("span", null, "No data");
    }
    const chunks = [];
    const hexString = raw.toString("hex");
    for (let i = 0; i < hexString.length; i += 2) {
        chunks.push(hexString.slice(i, i + 2));
    }
    const SPAN_SIZE = 4;
    const ROW_SIZE = 4 * SPAN_SIZE;
    const divs = [];
    let spans = [];
    for (let i = 0; i < chunks.length; i += SPAN_SIZE) {
        const color = i % (2 * SPAN_SIZE) === 0 ? "text-white" : "text-gray-500";
        spans.push(React.createElement("span", { key: i, className: color },
            chunks.slice(i, i + SPAN_SIZE).join(" "),
            "\u2003"));
        if (i % ROW_SIZE === ROW_SIZE - SPAN_SIZE ||
            i >= chunks.length - SPAN_SIZE) {
            divs.push(React.createElement("div", { key: i / ROW_SIZE }, spans));
            // clear spans
            spans = [];
        }
    }
    function Content() {
        return (React.createElement(Copyable, { text: hexString },
            React.createElement("pre", { className: "d-inline-block text-start mb-0" }, divs)));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "d-none d-lg-flex align-items-center justify-content-end" },
            React.createElement(Content, null)),
        React.createElement("div", { className: "d-flex d-lg-none align-items-center" },
            React.createElement(Content, null))));
};
