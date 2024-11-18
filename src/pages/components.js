import React from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import H1 from '../components/H1';
import H2 from '../components/H2';
import Button from '../components/Button';
import Block from '../components/Block';
import Saber from '../svg/saber';
import Address from '../components/Address';
import Input, { InputType } from '../components/Input';
import Table from '../components/Table';
const ComponentsPage = () => {
    return (React.createElement("div", { className: "max-w-2xl" },
        React.createElement("div", { className: "flex flex-col gap-5" },
            React.createElement("div", { className: "flex gap-3" },
                React.createElement(Saber, null),
                React.createElement(Saber, { className: "text-saber-light" }),
                React.createElement(Saber, { className: "text-saber-dark" })),
            React.createElement(H1, null, "This is a H1"),
            React.createElement(H2, null, "This is a H2"),
            React.createElement("p", null, "This is normal text"),
            React.createElement("p", { className: "text-secondary text-sm" }, "This is secondary text"),
            React.createElement(Button, null, "Primary button"),
            React.createElement(Button, { type: "secondary" }, "Secondary button"),
            React.createElement(Button, { size: "small" }, "Small button"),
            React.createElement(Button, { size: "full" }, "Full sized button"),
            React.createElement(Block, { className: "flex flex-col gap-3" },
                React.createElement(H2, null, "This is a block"),
                React.createElement("p", null, "It can contain any text"),
                React.createElement("p", { className: "text-secondary text-sm" }, "Or secondary text"),
                React.createElement("div", { className: "flex gap-3" },
                    React.createElement(Button, null, "And a button"),
                    React.createElement(Button, { type: "secondary" },
                        "And a secondary",
                        React.createElement(FaLongArrowAltRight, null)))),
            React.createElement(Block, { active: true, className: "flex flex-col gap-3" },
                React.createElement("p", null, "Blocks can also be in an active state")),
            React.createElement(Block, { className: "flex flex-col gap-3", hover: true },
                React.createElement("p", null, "Blocks can also have a hover effect")),
            React.createElement("span", null,
                "Address (with preferred explorer setting):",
                ' ',
                React.createElement(Address, { address: "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1" })),
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("p", null, "Normal input"),
                React.createElement(Input, { type: InputType.TEXT, placeholder: "Enter something here" })),
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("p", null, "Number input"),
                React.createElement(Input, { type: InputType.NUMBER, placeholder: "0.00" }))),
        React.createElement(Block, { className: "mt-5 flex flex-col gap-5" },
            React.createElement("p", null, "Table in a block"),
            React.createElement(Table, { data: [
                    { rowLink: '', data: ['Column 1', 'Column 2', 'Column 3', ''] },
                    {
                        rowLink: '',
                        data: [
                            'Value 1',
                            123.4,
                            'Something',
                            React.createElement(Button, { key: "b", size: "small" }, "View"),
                        ],
                    },
                    {
                        rowLink: '',
                        data: [
                            'Value 1',
                            123.4,
                            'Something',
                            React.createElement(Button, { type: "danger", key: "b", size: "small" }, "Withdraw"),
                        ],
                    },
                ] }))));
};
export default ComponentsPage;
export const Head = () => React.createElement("title", null, "Saber | Solana AMM");
