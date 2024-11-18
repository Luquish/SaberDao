import React, { useState } from "react";
import clsx from "clsx";
export function TokenIcon({ className, token, size = 28, }) {
    const [invalid, setInvalid] = useState(false);
    return (React.createElement("div", { className: clsx("rounded-full overflow-hidden", className), style: {
            height: `${size}px`,
            width: `${size}px`
        } }, invalid || !token?.icon ? (React.createElement("div", { className: "h-full w-full rounded-full border border-dashed border-[#ccc]" })) : (React.createElement("img", { src: token.icon, onError: () => {
            setInvalid(true);
        }, alt: `Icon for token ${token.name}`, className: "h-full w-full" }))));
}
