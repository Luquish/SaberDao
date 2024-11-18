import React from 'react';
import BaseContentLoader from 'react-content-loader';
import clsx from 'clsx';
export const ContentLoader = ({ children, className, width = 200, height = 20, backgroundColor = "#f3f3f3", foregroundColor = "#ecebeb" }) => {
    return (React.createElement(BaseContentLoader, { speed: 2, width: width, height: height, backgroundColor: backgroundColor, foregroundColor: foregroundColor, className: clsx("animate-pulse", className) }, children));
};
