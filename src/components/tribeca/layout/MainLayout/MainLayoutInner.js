import React, { Suspense } from "react";
import { Header } from "./Header";
import { PageLayout } from "./PageLayout";
export const MainLayoutInner = ({ children }) => {
    return (React.createElement("div", { className: "relative" },
        React.createElement("div", { className: "w-11/12 mx-auto" },
            React.createElement(Header, null)),
        React.createElement(PageLayout, null,
            React.createElement(Suspense, null, children))));
};
