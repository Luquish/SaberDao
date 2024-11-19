import { RewarderProvider } from "@rockooor/react-quarry";
import React from 'react';

import { useParsedGaugemeister } from "@/utils/tribeca/parsers";
import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import Card from "@/components/tribeca/common/governance/Card";
import LoadingPage from "@/components/tribeca/common/LoadingPage";
import { useGaugemeister } from "@/hooks/tribeca/useGaugemeister";
import CreateGaugesButton from "@/pages/tribeca/GovernanceManageView/tabs/GaugesTab/AddGaugeCard/CreateGaugesButton";
import EnableGaugesButton from "@/pages/tribeca/GovernanceManageView/tabs/GaugesTab/AddGaugeCard/EnableGaugesButton";
import GaugeSelector from "@/pages/tribeca/GovernanceManageView/tabs/GaugesTab/AddGaugeCard/GaugeSelector";

const AddGaugeCard: React.FC = () => {
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

export default AddGaugeCard;
