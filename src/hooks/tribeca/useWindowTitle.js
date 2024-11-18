import { useEffect } from "react";
/**
 * Sets the window title.
 * @param title
 */
export const useWindowTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
