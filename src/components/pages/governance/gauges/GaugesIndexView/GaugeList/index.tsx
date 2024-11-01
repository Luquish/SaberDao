import { RewarderProvider } from "@rockooor/react-quarry";

import { useEnvironment } from "../../../../../../utils/useEnvironment";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { useGM } from "../../context";
import { GaugeListInner } from "./GaugeListInner";

interface Props {
  limit?: number;
}

export const GaugeList: React.FC<Props> = ({ limit }: Props) => {
  const { rewarderKey } = useGM();
  const { network } = useEnvironment();

  return (
    <>
      {rewarderKey ? (
        <RewarderProvider initialState={{ rewarderKey, network }}>
          <GaugeListInner limit={limit} />
        </RewarderProvider>
      ) : (
        <LoadingPage tw="h-96"></LoadingPage>
      )}
    </>
  );
};
