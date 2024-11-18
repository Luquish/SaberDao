import { Global, css } from "@emotion/react";
import React from "react";
import { Header } from "./Header";
export const GovernorLayout = ({ children, placeholder = false, }) => {
    return (React.createElement("div", null,
        React.createElement(Header, { placeholder: placeholder }),
        React.createElement(Global, { styles: css `
          body {
            &.dark {
              background-color: #18181b;
            }
          }
        ` }),
        React.createElement("div", { className: "flex w-screen" },
            React.createElement("div", { className: "flex-grow h-full overflow-y-scroll" }, children))));
};
