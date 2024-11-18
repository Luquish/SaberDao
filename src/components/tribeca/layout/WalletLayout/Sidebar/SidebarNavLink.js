import React from 'react';
import { Link } from "gatsby";
export const SidebarNavLink = (props) => {
    return (React.createElement(Link, { className: "text-gray-700 text-sm font-medium h-7 flex items-center px-5 rounded cursor-pointer hover:bg-gray-100", activeClassName: "bg-gray-100", ...props }));
};
