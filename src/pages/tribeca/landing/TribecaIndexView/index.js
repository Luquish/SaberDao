import { useEffect } from "react";
import React from "react";
import { Header } from "../../../../components/tribeca/layout/GovernorLayout/Header";
import { Alliance } from "./Alliance";
import { Jumbotron } from "./Jumbotron";
export const TribecaIndexView = () => {
    useEffect(() => {
        document.body.classList.add("dark");
        return () => {
            document.body.classList.remove("dark");
        };
    }, []);
    return (React.createElement("div", { className: "relative" },
        React.createElement("div", { className: "relative w-screen min-h-screen" },
            React.createElement("div", { className: "absolute", style: {
                    left: '30%',
                    bottom: '30%',
                    transform: 'translate(-50%, 0px)',
                    width: '1560px',
                    height: '1560px',
                    background: 'radial-gradient(50% 50% at 50% 50%, rgb(150, 50, 249) 0%, rgba(0, 0, 0, 0) 100%)'
                } }),
            React.createElement("div", { className: "w-11/12 mx-auto" },
                React.createElement(Header, { placeholder: true })),
            React.createElement(Jumbotron, null)),
        React.createElement("div", { className: "overflow-x-hidden" },
            React.createElement("div", { className: "w-11/12" },
                React.createElement(Alliance, null)))));
};
