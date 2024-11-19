import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useGaugemeisterData } from "@/utils/tribeca/parsers";

export const useGaugemeister = () => {
  const { gauge } = useGovernor();
  return gauge ? gauge.gaugemeister : null;
};

export const useGMData = () => {
  const gm = useGaugemeister();
  return useGaugemeisterData(gm);
};
