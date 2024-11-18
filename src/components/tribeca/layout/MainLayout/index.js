import React, { Suspense } from "react";
import { Outlet } from "react-router";
import { MainLayoutInner } from "./MainLayoutInner";
export const MainLayout = () => {
    return (React.createElement(MainLayoutInner, null,
        React.createElement(Suspense, null,
            React.createElement(Outlet, null))));
};
