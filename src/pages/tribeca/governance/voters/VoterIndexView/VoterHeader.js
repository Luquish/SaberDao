import makeBlockie from "ethereum-blockies-base64";
import { FaTwitter } from "react-icons/fa";
import React from 'react';
import { useAddressImage } from "@/hooks/tribeca/cardinal/useAddressImage";
import { useCardinalDisplayName } from "@/hooks/tribeca/cardinal/useAddressName";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
export const VoterHeader = ({ voterKey }) => {
    const { displayName, name } = useCardinalDisplayName(voterKey ?? undefined);
    const { addressImage, loadingImage } = useAddressImage(voterKey ?? undefined);
    return (React.createElement("div", { className: "flex items-center gap-2.5" },
        React.createElement("div", { className: "h-11 w-11 flex" }, loadingImage || !voterKey ? (React.createElement(ContentLoader, { className: "h-full w-full rounded-full" })) : (React.createElement("img", { className: "h-full w-full rounded-full", alt: `Profile of ${displayName ?? voterKey.toString()}`, src: addressImage ?? makeBlockie(voterKey.toString()) }))),
        React.createElement("div", { className: "flex flex-col gap-0.5" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement("h1", { className: "text-2xl md:text-3xl font-bold text-white tracking-tighter" }, displayName),
                name?.startsWith("@") && (React.createElement("a", { href: `https://twitter.com/${name.slice(1)}`, target: "_blank", rel: "noreferrer" },
                    React.createElement(FaTwitter, { className: "h-5 w-5", style: { color: '#1da1f2' } })))),
            React.createElement("div", { className: "h-6 flex items-center dark:text-warmGray-400" }, voterKey ? (React.createElement(AddressLink, { className: "dark:text-warmGray-400 font-semibold text-xs", address: voterKey, shorten: false, showCopy: true })) : (React.createElement(ContentLoader, { className: "w-48 h-4" }))))));
};
