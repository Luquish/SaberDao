import React from 'react';
import H1 from '../components/H1';
const NotFoundPage = () => {
    return (React.createElement("div", { className: "max-w-2xl" },
        React.createElement(H1, null, "Page not found"),
        React.createElement("p", null, "The page you are looking for does not exist.")));
};
export default NotFoundPage;
export const Head = () => React.createElement("title", null, "Saber | Solana AMM");
