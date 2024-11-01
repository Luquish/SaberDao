import { RewarderProvider } from "@rockooor/react-quarry";
import tw from "twin.macro";

import { useParsedGaugemeister } from "../../../../../../../utils/parsers";
import { useEnvironment } from "../../../../../../../utils/useEnvironment";
import { Card } from "../../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../../common/LoadingPage";
import { useGaugemeister } from "../../../../gauges/hooks/useGaugemeister";
import { CreateGaugesButton } from "./CreateGaugesButton";
import { EnableGaugesButton } from "./EnableGaugesButton";
import { GaugeSelector } from "./GaugeSelector";

export const AddGaugeCard: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const gm = useParsedGaugemeister(gaugemeister);
  const { network } = useEnvironment();

  const rewarderKey = gm.data?.accountInfo.data.rewarder;

  if (!rewarderKey) {
    return (
      <Card title="All Gauges">
        <LoadingPage />
      </Card>
    );
  }

  return (
    <RewarderProvider initialState={{ rewarderKey, network }}>
      <Card
        titleStyles={tw`flex items-center justify-between`}
        title={
          <>
            <span>All Gauges</span>
            <div tw="flex items-center gap-4">
              <CreateGaugesButton />
              <EnableGaugesButton />
            </div>
          </>
        }
      >
        <GaugeSelector />
      </Card>
    </RewarderProvider>
  );
};
