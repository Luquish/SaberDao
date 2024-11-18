import React from "react";
import { NotifiLogo } from "./NotifiLogo";
export const SubscriptionCard = ({ body, switchGroup, }) => {
    return (React.createElement("div", { className: "w-screen max-w-[312px]" },
        React.createElement("div", { className: "w-full bg-white rounded-lg border dark:(bg-warmGray-850 border-warmGray-800)" },
            React.createElement("div", { className: "flex flex-col items-stretch gap-2 py-2 px-4 border-b dark:border-warmGray-800" },
                React.createElement("h2", { className: "text-white font-bold mb-2" }, "Get Notifications"),
                body),
            switchGroup,
            React.createElement("div", { className: "flex items-center justify-start py-2 px-4 dark:border-warmGray-800" },
                React.createElement("span", { className: "text-xs" }, "Powered by"),
                React.createElement(NotifiLogo, { className: "h-4 w-16 ml-1 pb-1" }),
                React.createElement("span", { className: "flex-grow" }),
                React.createElement("span", { className: "text-xs ml-1 hover:text-primary" },
                    React.createElement("a", { href: "https://notifi.network/faqs", target: "_blank", rel: "noopener noreferrer" }, "Learn more"))))));
};
