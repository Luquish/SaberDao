import { RewarderProvider } from "@rockooor/react-quarry";
import { Link } from "react-router-dom";

import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ExternalLink } from "../../../../common/typography/ExternalLink";
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
      <div tw="flex flex-col gap-4">
        <div tw="flex flex-col md:flex-row gap-4">
          <GaugemeisterInfo tw="flex-1" />
          <Card title="Gauge Weight Voting" tw="flex-1">
            <div tw="px-8 py-5 text-sm flex flex-col gap-4">
              <p>
                Vote for gauge weight with your {veToken?.symbol} tokens (locked{" "}
                {govToken?.symbol} tokens in{" "}
                <Link tw="text-primary hover:text-white" to={`${path}/locker`}>
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
        <div tw="flex flex-col gap-8">
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
