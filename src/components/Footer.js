import React from 'react';
export default function Footer() {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "w-full flex flex-col lg:flex-row gap-1" },
            React.createElement("div", { className: "flex-grow flex-wrap flex justify-center gap-3 items-center" },
                React.createElement("a", { href: "https://doc.saberdao.io/saber-dao/risks", target: "_blank", rel: "noreferrer", className: "underline hover:no-underline" }, "Risks"),
                "\u00A9 Saber DAO 2024"))));
}
