import { useEffect, useState } from "react";
import React from "react";
export const ImageWithFallback = ({ className, src, size = 28, alt, ...imageProps }) => {
    const [invalid, setInvalid] = useState(false);
    useEffect(() => {
        setInvalid(false);
    }, [src]);
    return (React.createElement(Wrapper, { size: size }, invalid || !src ? (React.createElement(Placeholder, null)) : (React.createElement("img", { ...imageProps, src: src, onError: () => {
            setInvalid(true);
        }, alt: alt }))));
};
const Wrapper = ({ size, children }) => (React.createElement("div", { className: `h-[${size}px] w-[${size}px] rounded-full overflow-hidden` }, children));
const Placeholder = () => (React.createElement("div", { className: "h-full w-full border-2 border-dashed rounded-full", style: { borderColor: "#ccc" } }));
