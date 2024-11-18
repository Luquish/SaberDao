import { navigate as gatsbyNavigate } from "gatsby";
import { useEffect } from "react";
export const useHashRouterCompat = () => {
    const location = typeof window !== 'undefined' ? window.location : {};
    const { hash } = location;
    useEffect(() => {
        if (hash?.startsWith("#/")) {
            const navigateTo = gatsbyNavigate;
            void navigateTo(hash.replace("#", ""));
        }
    }, [hash]);
};
