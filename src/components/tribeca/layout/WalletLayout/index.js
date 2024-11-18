import React from 'react';
import { Sidebar } from "./Sidebar";
export const WalletLayout = ({ children }) => {
    return (React.createElement("div", { className: "flex w-screen" },
        React.createElement(Sidebar, null),
        React.createElement("div", { className: "flex-grow h-screen overflow-y-scroll" }, children)));
};
