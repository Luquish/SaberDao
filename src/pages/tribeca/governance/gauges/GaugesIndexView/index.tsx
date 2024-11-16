import { RewarderProvider } from "@rockooor/react-quarry";
import { Link } from "gatsby";
import React from "react";

import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useParsedGaugemeister } from "../../../../../utils/tribeca/parsers";
import { useEnvironment } from "../../../../../utils/tribeca/useEnvironment";
import { Card } from "../../../../../components/tribeca/common/governance/Card";
import { GovernancePage } from "../../../../../components/tribeca/common/governance/GovernancePage";
import { ExternalLink } from "../../../../../components/tribeca/common/typography/ExternalLink";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { AllGaugesPreview } from "./AllGaugesPreview";
import { GaugemeisterInfo } from "./GaugemeisterInfo";
import { UserGauges } from "./UserGauges";

export const GaugesIndexView: React.FC = () => {
  const gaugemeister = useGaugemeister();
  useGovWindowTitle(`Gauges`);
  const { govToken, veToken, path } = useGovernor();
  const { network } = useEnvironment();
  const gm = useParsedGaugemeister(gaugemeister);
  const rewarderKey = gm.data?.accountInfo.data.rewarder;

  return (
    <GovernancePage title="Gauges">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <GaugemeisterInfo className="flex-1" />
          <Card title="Gauge Weight Voting" className="flex-1">
            <div className="px-8 py-5 text-sm flex flex-col gap-4">
              <p>
                Vote for gauge weight with your {veToken?.symbol} tokens (locked{" "}
                {govToken?.symbol} tokens in{" "}
                <Link 
                  className="text-primary hover:text-white" 
                  to={`${path}/locker`}
                >
                  Locker
                </Link>
                ). Gauge weights are used to determine how much{" "}
                {govToken?.symbol} each Quarry gets.
              </p>
              <p>
                Your voting power is converted 1:1 to Quarry rewards share,
                based on the weights you provided.
              </p>
              <ExternalLink href="https://docs.tribeca.so/features/gauges">
                Learn more
              </ExternalLink>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-8">
          {rewarderKey && (
            <RewarderProvider initialState={{ rewarderKey, network }}>
              <UserGauges />
              <AllGaugesPreview />
            </RewarderProvider>
          )}
        </div>
      </div>
    </GovernancePage>
  );
};

export default GaugesIndexView;
