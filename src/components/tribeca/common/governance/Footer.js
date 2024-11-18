import { pickBy } from "lodash-es";
import { FaDiscord, FaGithub, FaMedium, FaTwitter } from "react-icons/fa";
import React from "react";
import { useGovernor } from "../../../../hooks/tribeca/useGovernor";
import { Button } from "../Button";
import { PageContainer } from "./GovernancePageInner";
const SOCIALS = {
    discord: React.createElement(FaDiscord, null),
    github: React.createElement(FaGithub, null),
    medium: React.createElement(FaMedium, null),
    twitter: React.createElement(FaTwitter, null),
};
export const Footer = () => {
    const { manifest } = useGovernor();
    if (!manifest) {
        return null;
    }
    const otherLinks = pickBy(manifest.links ?? {}, (_v, k) => {
        return !(k in SOCIALS) && k !== "app";
    });
    return (React.createElement("footer", { className: "w-full bg-warmGray-900 pt-5" },
        React.createElement(PageContainer, { className: "w-11/12" },
            React.createElement("div", { className: "flex flex-col gap-8 md:flex-row justify-between py-8" },
                React.createElement("div", { className: "md:block" },
                    React.createElement("a", { href: manifest.links?.website?.url ?? "#", target: "_blank", rel: "noreferrer" },
                        React.createElement("div", { className: "w-9 h-9" },
                            React.createElement("img", { src: manifest.governance.iconURL, alt: `Icon of ${manifest.governance.name}` })))),
                React.createElement("div", { className: "flex gap-24" },
                    Object.entries(otherLinks).length > 0 && (React.createElement("div", null,
                        React.createElement("h2", { className: "text-white font-semibold mb-4" }, manifest.governance.name),
                        React.createElement("div", { className: "flex flex-col gap-3 text-warmGray-600 text-sm" }, Object.entries(otherLinks).map(([name, link]) => {
                            return (React.createElement("a", { key: name, href: link.url, target: "_blank", rel: "noreferrer" }, link.label));
                        })))),
                    React.createElement("div", null,
                        React.createElement("h2", { className: "text-white font-semibold mb-4" }, "Tribeca"),
                        React.createElement("div", { className: "flex flex-col gap-3 text-warmGray-600 text-sm" }, Object.entries({
                            Documentation: "https://docs.tribeca.so",
                            GitHub: "https://github.com/TribecaHQ",
                        }).map(([name, link]) => {
                            return (React.createElement("a", { key: name, href: link, target: "_blank", rel: "noreferrer" }, name));
                        })))),
                React.createElement("div", { className: "flex md:justify-end" },
                    React.createElement("div", null, manifest?.links?.app && (React.createElement("a", { href: manifest.links.app.url, target: "_blank", rel: "noreferrer" },
                        React.createElement(Button, { size: "md", variant: "outline" }, manifest.links.app.label)))))),
            React.createElement("div", { className: "flex justify-between items-center py-8 mt-8 border-t border-t-warmGray-850 text-xs" },
                React.createElement("p", { className: "text-warmGray-700" }, "Built by the Tribeca DAO"),
                React.createElement("div", { className: "flex gap-4" }, Object.entries(SOCIALS).map(([id, icon]) => {
                    const link = manifest.links?.[id];
                    if (!link) {
                        return null;
                    }
                    return (React.createElement("a", { key: id, href: link.url, target: "_blank", rel: "noreferrer", className: "hover:text-primary transition-colors [&>svg]:w-4 [&>svg]:h-4" }, icon));
                }))))));
};
