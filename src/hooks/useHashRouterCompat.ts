import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useHashRouterCompat = () => {
  // remove hashes
  const { hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (hash.startsWith("#/")) {
      navigate(hash.replace("#", ""), {
        replace: true,
      });
    }
  }, [hash, navigate]);
};
