import React from "react";
import { Helmet } from "react-helmet";
import { APP_CONFIG } from "../../../config";
export const CommonHelmet = ({ title, pageTitle = `${title} | ${APP_CONFIG.name}`, description, }) => {
    return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    React.createElement(Helmet, null,
        React.createElement("title", null, pageTitle),
        description && React.createElement("meta", { name: "description", content: description }),
        description && React.createElement("meta", { name: "og:description", content: description }),
        description && React.createElement("meta", { name: "twitter:description", content: description }),
        React.createElement("meta", { name: "og:title", content: title }),
        React.createElement("meta", { name: "twitter:title", content: title })));
};
