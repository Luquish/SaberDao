import { GaugeSDK } from "@quarryprotocol/gauge";
import type { OperatorData, RewarderData } from "@quarryprotocol/quarry-sdk";
import type { ParsedAccountInfo } from "@rockooor/sail";
import { useSail } from "@rockooor/sail";
import invariant from "tiny-invariant";
import React from "react";

import { useSDK } from "@/contexts/sdk";
import { useGovernor } from "@/hooks/tribeca/useGovernor";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AttributeList } from "@/components/tribeca/common/AttributeList";
import { ModalInner } from "@/components/tribeca/common/Modal/ModalInner";

interface Props {
  operator: ParsedAccountInfo<OperatorData>;
  rewarder: ParsedAccountInfo<RewarderData>;
  startTime: Date;
}

export const CreateGaugemeisterModal: React.FC<Props> = ({
  operator,
  rewarder,
  startTime,
}: Props) => {
  const { handleTX } = useSail();
  const { wrapTx } = useWrapTx();
  const { lockerData } = useGovernor();
  const { sdkMut } = useSDK();
  const create = async () => {
    invariant(sdkMut && lockerData);
    const gauge = GaugeSDK.load({ provider: sdkMut.provider });
    const { gaugemeister, tx: createGMTX } =
      await gauge.gauge.createGaugemeister({
        firstEpochStartsAt: startTime,
        locker: lockerData.publicKey,
        operator: operator.accountId,
      });

    const { pending, success } = await handleTX(
      await wrapTx(createGMTX),
      `Create Gaugemeister at ${gaugemeister.toString()}`
    );
    if (!pending || !success) {
      return;
    }
    await pending.wait();
  };

  return (
    <ModalInner
      title="Create Gaugemeister"
      buttonProps={{
        onClick: create,
        variant: "primary",
        children: "Create Gaugemeister",
      }}
    >
      <div className="px-8 flex flex-col items-center">
        <p className="mb-4 text-sm">Set up your gauge system.</p>
        <AttributeList
          attributes={{
            Rewarder: rewarder.accountId,
            Operator: operator.accountId,
            "Start Time": startTime.toLocaleString(undefined, {
              timeZoneName: "short",
            }),
          }}
        />
      </div>
    </ModalInner>
  );
};
