import React from "react";
import { RewarderProvider } from "@rockooor/react-quarry";

import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import { useGM } from "@/contexts/tribeca/gauges";
import GaugeListInner from "./GaugeListInner";

interface Props {
  limit?: number;
}

const GaugeList: React.FC<Props> = ({ limit }: Props) => {
  const { rewarderKey } = useGM();
  const { network } = useEnvironment();

  return (
    <>
      {rewarderKey ? (
        <RewarderProvider initialState={{ rewarderKey, network }}>
          <GaugeListInner limit={limit} />
        </RewarderProvider>
      ) : (
        <LoadingPage className="h-96"></LoadingPage>
      )}
    </>
  );
};

export default GaugeList;
