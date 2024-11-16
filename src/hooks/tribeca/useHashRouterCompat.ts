import { WindowLocation } from "@reach/router";
import { navigate as gatsbyNavigate } from "gatsby";
import { useEffect } from "react";

export const useHashRouterCompat = () => {
  const location = typeof window !== 'undefined' ? window.location : {} as WindowLocation;
  const { hash } = location;
  
  useEffect(() => {
    if (hash?.startsWith("#/")) {
      const navigateTo = (gatsbyNavigate as unknown as (path: string) => Promise<void>);
      void navigateTo(hash.replace("#", ""));
    }
  }, [hash]);
};
