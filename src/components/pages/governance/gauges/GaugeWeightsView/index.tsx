import { ZERO } from "@quarryprotocol/quarry-sdk";
import { RewarderProvider } from "@rockooor/react-quarry";
import React from "react";
import { Link } from "react-router-dom";

import { useUserEscrow } from "../../../../../hooks/tribeca/useEscrow";
import {
  useGovernor,
  useGovWindowTitle,
} from "../../../../../hooks/tribeca/useGovernor";
import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { useEnvironment } from "../../../../../utils/useEnvironment";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { InputSearchText } from "../../../../common/inputs/InputSearchText";
import { LoadingPage } from "../../../../common/LoadingPage";
import { ExternalLink } from "../../../../common/typography/ExternalLink";
import { LockupTooShortTooltip } from "../GaugesSetupView/lockupTooShortTooltip";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { GaugeWeightsForm } from "./GaugeWeightsForm";
import { UpdateGaugeWeightsProvider } from "./useUpdateGaugeWeights";

export const GaugeWeightsView: React.FC = () => {
  const [filterTerm, setFilterTerm] = React.useState("");
  const gaugemeister = useGaugemeister();
  const gm = useParsedGaugemeister(gaugemeister);
  const { govToken, veToken, path } = useGovernor();
  const { network } = useEnvironment();
  const { escrow } = useUserEscrow();
  const rewarderKey = gm.data?.accountInfo.data.rewarder;

  const lockupTooShort = escrow?.escrow.escrowEndsAt.lt(
    gm.data?.accountInfo.data.nextEpochStartsAt ?? ZERO
  );

  useGovWindowTitle(`Your Gauge Weights`);
  return (
    <GovernancePage
      title="Your Gauge Weights"
      backLink={{
        label: "Gauges",
        href: `${path}/gauges`,
      }}
    >
      <div tw="flex flex-col gap-4">
        <Card title="Gauge Weight Voting">
          <div tw="px-8 py-5 text-sm">
            <p>
              You can vote for gauge weight with your {veToken?.symbol} tokens
              (locked {govToken?.symbol} tokens in{" "}
              <Link tw="text-primary hover:text-white" to={`${path}/locker`}>
                Locker
              </Link>
              ). Gauge weights are used to determine how much {govToken?.symbol}{" "}
              each pool gets.
            </p>
            <ExternalLink
              tw="mt-4"
              href="https://docs.tribeca.so/features/gauges"
            >
              Learn more
            </ExternalLink>
          </div>
        </Card>
        <Card
          title={
            <div tw="flex w-full items-center justify-between">
              <div tw="flex">
                <span>Your Gauge Weights</span>
                {lockupTooShort && <LockupTooShortTooltip />}
              </div>
              <InputSearchText
                onChange={(evt) => setFilterTerm(evt.target.value)}
                value={filterTerm}
                placeholder="Filter Gauges.."
              />
            </div>
          }
        >
          {gm.loading ? (
            <LoadingPage tw="p-16" />
          ) : (
            rewarderKey && (
              <RewarderProvider initialState={{ rewarderKey, network }}>
                <UpdateGaugeWeightsProvider>
                  <GaugeWeightsForm filterTerm={filterTerm} />
                </UpdateGaugeWeightsProvider>
              </RewarderProvider>
            )
          )}
        </Card>
      </div>
    </GovernancePage>
  );
};

export default GaugeWeightsView;
