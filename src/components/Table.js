// src/components/Table.tsx
import React from 'react';
import Block from './Block';
import clsx from 'clsx';
import { Link } from 'gatsby';
import { ConditionalWrapper } from './ConditionalWrapper';
export default function Table(props) {
    const header = props.data?.[0].data;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: clsx(!props.blockView && 'lg:hidden', props.blockView && 'md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5') }, props.data.slice(1).map((row, i) => (React.createElement(ConditionalWrapper, { condition: !!row.rowLink, key: `wrapper-${i}`, wrapper: (children) => (React.createElement(Link, { to: row.rowLink, key: i }, children)) },
            React.createElement(Block, { className: "grid grid-cols-2 gap-1 text-sm mb-5 lg:mb-0 h-full", hover: true }, row.data.map((item, j) => header[j] ? (React.createElement(React.Fragment, { key: `${i}-${j}` },
                React.createElement("div", { className: "font-bold" }, header[j]),
                React.createElement("div", { className: "flex justify-end text-gray-300" }, item))) : (React.createElement("div", { key: `${i}-${j}`, className: "col-span-2" }, item)))))))),
        !props.blockView && (React.createElement("div", { className: "hidden lg:block rounded-lg overflow-hidden" },
            React.createElement("div", { className: "grid gap-3 w-full" },
                React.createElement("div", { className: "flex bg-black py-3 px-5 rounded-lg" }, header.map((header, i) => (React.createElement("div", { className: "font-bold pr-5 flex-1", key: i }, header)))),
                props.data.slice(1).map((row, i) => (React.createElement(ConditionalWrapper, { condition: !!row.rowLink, key: `wrapper-${i}`, wrapper: (children) => (React.createElement(Link, { to: row.rowLink, key: i }, children)) },
                    React.createElement("div", { className: "flex hover:bg-saber-dark/20 transition-colors py-3 items-center rounded-lg px-3" }, row.data.map((item, j) => (React.createElement("div", { className: "flex-1", key: `${i}-${j}` }, item))))))))))));
}
