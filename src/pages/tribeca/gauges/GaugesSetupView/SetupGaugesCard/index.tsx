import { usePubkey } from "@rockooor/sail";
import { useState } from "react";
import React from 'react';

import {
  useParsedOperator,
  useParsedRewarder,
} from "@/utils/tribeca/parsers";
import { Card } from "@/components/tribeca/common/governance/Card";
import { InputText } from "@/components/tribeca/common/inputs/InputText";
import { ModalButton } from "@/components/tribeca/common/Modal/ModalButton";
import { CreateGaugemeisterModal } from "./CreateGaugemeisterModal";

export const SetupGaugesCard: React.FC = () => {
  const [rewarderKeyStr, setRewarderKeyStr] = useState<string>("");
  const rewarderKey = usePubkey(rewarderKeyStr);

  const [startTime, setStartTime] = useState<string>(
    new Date().toISOString().split("Z")[0] ?? ""
  );

  const { data: rewarder } = useParsedRewarder(rewarderKey);
  const { data: operator } = useParsedOperator(
    rewarder?.accountInfo.data.authority
  );

  const disabledReason = !rewarder
    ? "Rewarder does not exist"
    : !operator
    ? "Must be operator"
    : null;

  return (
    <Card title="Setup Gauges">
      <div className="px-7 py-4 text-sm">
        <p className="mb-4">
          Gauges allow DAO members to vote on where they want liquidity mining
          rewards to exist.
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <label className="flex flex-col gap-1" htmlFor="rewarderKey">
            <span className="text-sm">Rewarder Key</span>
            <InputText
              id="rewarderKey"
              type="text"
              placeholder="Your Quarry Rewarder."
              value={rewarderKeyStr}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRewarderKeyStr(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1" htmlFor="startTime">
            <span className="text-sm">First Epoch Start Time</span>
            <InputText
              id="startTime"
              type="datetime-local"
              placeholder="Your Quarry Rewarder."
              value={startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
            />
          </label>
          <ModalButton
            buttonLabel={disabledReason ?? "Create Gaugemeister"}
            buttonProps={{
              disabled: !!disabledReason,
            }}
          >
            {operator && rewarder && (
              <CreateGaugemeisterModal
                rewarder={rewarder}
                operator={operator}
                startTime={new Date(startTime)}
              />
            )}
          </ModalButton>
        </form>
      </div>
    </Card>
  );
};
