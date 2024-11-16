import { createContainer } from "unstated-next";

import { useGaugemeisterData } from "../../../../utils/parsers";
import { useGaugemeister } from "./hooks/useGaugemeister";

const useGMInner = () => {
  const gaugemeister = useGaugemeister();
  const { data: gmData } = useGaugemeisterData(gaugemeister);
  const rewarderKey = gmData?.account.rewarder;
  const votingEpoch = gmData ? gmData.account.currentRewardsEpoch + 1 : gmData;

  return { gaugemeister, gmData, rewarderKey, votingEpoch };
};

export const { useContainer: useGM, Provider: GMProvider } =
  createContainer(useGMInner);
