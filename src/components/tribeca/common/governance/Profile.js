import { FaTwitter } from "react-icons/fa";
import { Link } from "gatsby";
import React from "react";
import clsx from "clsx";
import { useAddressImage } from "../../../../hooks/tribeca/cardinal/useAddressImage";
import { useCardinalDisplayName } from "../../../../hooks/tribeca/cardinal/useAddressName";
import { AddressLink } from "../AddressLink";
import { ContentLoader } from "../ContentLoader";
// Componente ContentLoader con tipos correctos
const StyledContentLoader = ({ className }) => (React.createElement(ContentLoader, null,
    React.createElement("rect", { className: className })));
export const Profile = ({ address, href }) => {
    const { name, displayName } = useCardinalDisplayName(address);
    const { addressImage, loadingImage } = useAddressImage(address);
    // Generamos un placeholder si no hay imagen
    const generatePlaceholder = () => {
        const str = address.toString();
        return `data:image/svg+xml,<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%23${str.slice(2, 8)}"/></svg>`;
    };
    const image = (React.createElement("img", { className: "h-10 w-10 rounded-full", alt: `Profile of ${displayName ?? address.toString()}`, src: addressImage ?? generatePlaceholder() }));
    return (React.createElement("div", { className: "text-sm" },
        React.createElement("div", { className: "flex gap-2 items-center" },
            React.createElement("div", { className: "h-10 w-10 rounded-full flex" }, loadingImage ? (React.createElement(StyledContentLoader, { className: "h-10 w-10 rounded-full" })) : href ? (React.createElement(Link, { to: href }, image)) : (image)),
            React.createElement("div", { className: "flex flex-col leading-normal" },
                React.createElement("div", { className: "flex gap-1 items-center" },
                    React.createElement("div", { className: "h-5 flex items-center" }, displayName === undefined ? (React.createElement(StyledContentLoader, { className: "h-4 w-12 rounded" })) : (React.createElement("span", { className: clsx("font-medium", name ? "text-white" : "text-warmGray-400") }, displayName))),
                    name?.startsWith("@") && (React.createElement("a", { href: `https://twitter.com/${name.slice(1)}`, target: "_blank", rel: "noreferrer" },
                        React.createElement(FaTwitter, { className: "text-[#1da1f2]" })))),
                React.createElement(AddressLink, { className: "text-gray-400", address: address, showCopy: true })))));
};
