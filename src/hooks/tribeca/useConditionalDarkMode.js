import { useEffect } from "react";
export const useConditionalDarkMode = (condition) => {
    useEffect(() => {
        if (condition) {
            document.body.classList.add("dark");
            return () => {
                document.body.classList.remove("dark");
            };
        }
    }, [condition]);
};
