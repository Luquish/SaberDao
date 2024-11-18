import React, { useRef, useState } from "react";
import { FaBook, FaCode, FaDiscord, FaEllipsisH, FaMedium, FaTwitter, } from "react-icons/fa";
import { APP_CONFIG } from "../../../../../config";
import { Drop } from "../../../common/Drop";
export const MoreInfo = () => {
    const [show, setShow] = useState(false);
    const targetRef = useRef(null);
    const MORE_ITEMS = [
        APP_CONFIG.socials.medium && {
            label: "Medium",
            slug: "medium",
            href: `https://medium.com/@${APP_CONFIG.socials.medium}`,
            icon: React.createElement(FaMedium, null),
        },
        APP_CONFIG.socials.twitter && {
            label: "Twitter",
            slug: "twitter",
            href: `https://twitter.com/${APP_CONFIG.socials.twitter}`,
            icon: React.createElement(FaTwitter, null),
        },
        // {
        //   label: "Chat",
        //   href: `https://keybase.io/team/${APP_CONFIG.socials.keybase}`,
        //   slug: "chat",
        //   icon: <IoMdChatboxes />,
        // },
        APP_CONFIG.socials.discord && {
            label: "Discord",
            href: `https://discord.gg/${APP_CONFIG.socials.discord}`,
            slug: "discord",
            icon: React.createElement(FaDiscord, null),
        },
        APP_CONFIG.code && {
            label: "Code",
            href: APP_CONFIG.code,
            slug: "code",
            icon: React.createElement(FaCode, null),
        },
        APP_CONFIG.docs && {
            label: "Docs",
            href: APP_CONFIG.docs,
            slug: "docs",
            icon: React.createElement(FaBook, null),
        },
    ].filter((x) => !!x);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { ref: targetRef, onClick: () => {
                setShow(!show);
            } },
            React.createElement("div", { className: "text-xl" },
                React.createElement(FaEllipsisH, null))),
        React.createElement(Drop, { placement: "bottom-end", show: show, onDismiss: () => setShow(false), target: targetRef.current },
            React.createElement("div", { className: "flex flex-col flex-nowrap p-2 bg-white shadow border rounded dark:(bg-warmGray-850 border-warmGray-800)" }, MORE_ITEMS.map((item) => (React.createElement("a", { href: item.href, type: "button", key: item.slug, target: "_blank", rel: "noopener noreferrer", className: "space-x-3 text-gray-900 hover:text-primary p-2 font-medium flex items-center appearance-none dark:(text-white hover:text-primary)" },
                React.createElement("div", null, item.icon),
                React.createElement("div", null, item.label))))))));
};
