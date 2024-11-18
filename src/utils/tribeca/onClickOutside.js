import { useEffect, useRef } from "react";
export const useOnClickOutside = (node, handler) => {
    const handlerRef = useRef(handler);
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (node.current?.contains(e.target) ?? false) {
                return;
            }
            if (handlerRef.current)
                handlerRef.current(e);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [node]);
};
