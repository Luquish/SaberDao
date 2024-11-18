import { RewarderProvider } from "@rockooor/react-quarry";
import React from 'react';

import { useParsedGaugemeister } from "@/utils/tribeca/parsers";
import { useEnvironment } from "@/utils/tribeca/useEnvironment";
import { Card } from "@/components/tribeca/common/governance/Card";
import { LoadingPage } from "@/components/tribeca/common/LoadingPage";
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
        titleClassName="flex items-center justify-between"
        title={
          <>
            <span>All Gauges</span>
            <div className="flex items-center gap-4">
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
