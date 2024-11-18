import { css, keyframes } from "@emotion/react";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "../../../common/Button";
const FADE_IN_DOWN = keyframes `
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
export const Jumbotron = () => {
    return (React.createElement("header", { tw: "w-full flex flex-col gap-6 pt-16 relative" },
        React.createElement("div", { tw: "w-11/12 md:(w-full max-w-4xl) flex flex-col gap-6 mx-auto" },
            React.createElement("div", { tw: "flex flex-col gap-2" },
                React.createElement("h1", { tw: "text-3xl font-bold leading-snug text-white relative md:(text-7xl leading-snug)" },
                    React.createElement("div", { css: css `
                animation: 1.5s ${FADE_IN_DOWN} 0.01s normal forwards ease-out;
              ` }, "Governance."),
                    React.createElement("div", { css: css `
                opacity: 0;
                animation: 1.5s ${FADE_IN_DOWN} 0.2s normal forwards ease-out;
              ` }, "By DAOs, for DAOs."))),
            React.createElement("p", { tw: "text-gray-200 text-base leading-relaxed max-w-3xl md:(text-2xl leading-relaxed)", css: css `
            opacity: 0;
            animation: 1.5s ${FADE_IN_DOWN} 0.4s normal forwards ease-out;
          ` }, "Tribeca is a protocol for creating, managing, and interacting with decentralized autonomous organizations on Solana."),
            React.createElement("div", { tw: "mt-6 flex flex-col gap-4 md:flex-row", css: css `
            opacity: 0;
            animation: 1.5s ${FADE_IN_DOWN} 0.6s normal forwards ease-out;
          ` },
                React.createElement("a", { target: "_blank", href: "https://github.com/TribecaHQ/tribeca", rel: "noreferrer" },
                    React.createElement(Button, { variant: "primary", tw: "flex font-semibold items-center gap-4 h-12 w-[200px] text-base hover:(border-none bg-white text-black)" },
                        React.createElement("span", null, "View the Code"),
                        React.createElement(FaArrowRight, null))),
                React.createElement("a", { target: "_blank", href: "https://docs.tribeca.so", rel: "noreferrer" },
                    React.createElement(Button, { variant: "outline", tw: "flex font-semibold items-center gap-4 h-12 w-[200px] text-base hover:(border-none bg-white text-black)" },
                        React.createElement("span", null, "Read the Docs"),
                        React.createElement(FaArrowRight, null)))))));
};
