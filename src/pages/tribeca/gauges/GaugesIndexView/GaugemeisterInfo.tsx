import { GaugeSDK } from "@quarryprotocol/gauge";
import { useSail } from "@rockooor/sail";
import Countdown from "react-countdown";
import invariant from "tiny-invariant";
import React from "react";

import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { useParsedGaugemeister } from "@/utils/tribeca/parsers";
import { tsToDate } from "@/utils/tribeca/utils";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { ContentLoader } from "@/components/tribeca/common/ContentLoader";
import { Card } from "@/components/tribeca/common/governance/Card";
import { CardItem } from "@/pages/tribeca/locker/LockerIndexView/locked-voter/CardItem";
import { useGaugemeister } from "../hooks/useGaugemeister";

interface Props {
  className?: string;
}

export const GaugemeisterInfo: React.FC<Props> = ({ className }: Props) => {
  const gaugemeister = useGaugemeister();
  const { data: gm } = useParsedGaugemeister(gaugemeister);
  const nextEpochStartsAt = gm
    ? tsToDate(gm.accountInfo.data.nextEpochStartsAt)
    : null;
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  return (
    <Card title="Epoch Info" className={className}>
      <CardItem label="Current Epoch">
        <div className="flex items-center gap-2.5 h-7">
          {gm ? (
            gm.accountInfo.data.currentRewardsEpoch
          ) : (
            <div className="h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" />
          )}
        </div>
      </CardItem>
      <CardItem label="Next Epoch Start">
        <div className="flex items-center gap-2.5 h-7">
          {nextEpochStartsAt ? (
            nextEpochStartsAt <= new Date() ? (
              <AsyncButton
                onClick={async (sdkMut) => {
                  invariant(gaugemeister);
                  const gaugeSDK = GaugeSDK.load({
                    provider: sdkMut.provider,
                  });
                  const triggerTX = gaugeSDK.gauge.triggerNextEpoch({
                    gaugemeister,
                  });
                  await handleTX(await wrapTx(triggerTX), "Trigger next epoch");
                }}
              >
                Trigger next epoch
              </AsyncButton>
            ) : (
              <Countdown date={nextEpochStartsAt} />
            )
          ) : (
            <ContentLoader className="h-4 w-12" />
          )}
        </div>
      </CardItem>
      <CardItem label="Next Rewards Period">
        <div className="flex items-center gap-2.5 h-14 text-sm leading-snug">
          {nextEpochStartsAt ? (
            <>
              {nextEpochStartsAt.toLocaleString()} -<br />
              {new Date(
                nextEpochStartsAt.getTime() +
                  (gm?.accountInfo.data.epochDurationSeconds ?? 0) * 1000
              ).toLocaleString()}
            </>
          ) : (
            <ContentLoader className="h-4 w-12" />
          )}
        </div>
      </CardItem>
    </Card>
  );
};
