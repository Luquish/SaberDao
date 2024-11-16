import { PoolManagerSDK } from "@saberhq/pool-manager";
import type { StableSwapState } from "@saberhq/stableswap-sdk";
import type { ProgramAccount } from "@saberhq/token-utils";
import { u64 } from "@saberhq/token-utils";
import BN from "bn.js";
import { useState } from "react";
import invariant from "tiny-invariant";

import type { SaberSwap } from "../../../../../hooks/saber/useSaberSwaps";
import { useExecutiveCouncil } from "../../../../../hooks/tribeca/useExecutiveCouncil";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Card } from "../../../../common/governance/Card";
import { InputText } from "../../../../common/inputs/InputText";
import { LabeledInput } from "../../../../common/inputs/LabeledInput";
import { SABER_POOL_MANAGER } from ".";

interface Props {
  swap: SaberSwap;
  swapInfo: ProgramAccount<StableSwapState>;
}

export const RampA: React.FC<Props> = ({ swap, swapInfo }: Props) => {
  const [targetA, setTargetA] = useState<string>(
    swapInfo.account.targetAmpFactor.toString()
  );
  const [rampStr, setRampStr] = useState<string>("1");
  const { ownerInvokeTX } = useExecutiveCouncil();

  let targetAU64: u64 | null = null;
  try {
    targetAU64 = new u64(targetA);
  } catch (e) {
    //
  }

  let ramp: number | null = null;
  try {
    ramp = parseFloat(rampStr);
  } catch (e) {
    //
  }

  const disabledReason =
    ramp === null
      ? "Enter a valid ramp duration"
      : ramp <= 0
      ? "Ramp must be a positive number"
      : !targetAU64
      ? "Enter a valid target A"
      : targetAU64.lte(new BN(10))
      ? "A must be at least 10"
      : null;

  return (
    <Card title="Ramp A" padded>
      <div tw="flex flex-col gap-4">
        <LabeledInput
          type="number"
          Component={InputText}
          label="Initial A"
          value={swapInfo.account.targetAmpFactor.toString()}
          disabled
        />
        <LabeledInput
          type="number"
          Component={InputText}
          label="Target A"
          value={targetA}
          onChange={(e) => {
            setTargetA(e.target.value);
          }}
        />
        <LabeledInput
          type="number"
          Component={InputText}
          label="Ramp Duration (days)"
          value={rampStr}
          onChange={(e) => {
            setRampStr(e.target.value);
          }}
        />
        <div>
          <AsyncButton
            disabled={!!disabledReason}
            onClick={async (sdkMut) => {
              invariant(ramp && targetAU64);
              const poolManagerSDK = PoolManagerSDK.load({
                provider: sdkMut.provider,
              });
              const poolManager = await poolManagerSDK.loadManager(
                SABER_POOL_MANAGER
              );
              const poolWrapper = await poolManager.loadPoolWrapper(
                swap.addresses.admin
              );

              const stopRampTs = Date.now() / 1_000 + ramp * 86_400;
              const tx = poolWrapper.rampA(targetAU64, stopRampTs);
              await ownerInvokeTX(
                tx,
                `Ramp A to ${targetAU64.toString()} over ${ramp} days`
              );
            }}
          >
            {disabledReason ??
              `Ramp A to ${targetAU64?.toString() ?? "--"} over ${
                ramp ?? "??"
              } days`}
          </AsyncButton>
        </div>
      </div>
    </Card>
  );
};
