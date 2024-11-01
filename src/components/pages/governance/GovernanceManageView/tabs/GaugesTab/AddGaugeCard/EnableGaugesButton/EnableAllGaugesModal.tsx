import type { GaugeData } from "@quarryprotocol/gauge";
import { GaugeSDK } from "@quarryprotocol/gauge";
import type { BatchedParsedAccountQueryData } from "@rockooor/sail";
import { useSail } from "@rockooor/sail";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../../../../contexts/sdk";
import { useWrapTx } from "../../../../../../../../hooks/useWrapTx";
import { useModal } from "../../../../../../../common/Modal/context";
import { ModalInner } from "../../../../../../../common/Modal/ModalInner";
import { useGaugemeister } from "../../../../../gauges/hooks/useGaugemeister";

interface Props {
  gauges?: BatchedParsedAccountQueryData<GaugeData>;
}

export const EnableAllGaugesModal: React.FC<Props> = ({ gauges }: Props) => {
  const { sdkMut } = useSDK();
  const gaugemeister = useGaugemeister();
  const { handleTXs } = useSail();
  const { wrapTx } = useWrapTx();

  const { close } = useModal();

  const disabledGauges = gauges?.filter((g) => g?.account.isDisabled);

  const create = async () => {
    invariant(sdkMut && gaugemeister);
    const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider });

    const enableTXs = await Promise.all(
      disabledGauges?.map(async (gauge) => {
        if (!gauge) {
          return null;
        }
        const enableGaugeTX = await gaugeSDK.gauge.enableGauge({
          gauge: gauge.publicKey,
        });
        return enableGaugeTX;
      }) ?? []
    );
    const bigEnvelope = TransactionEnvelope.combineAll(
      ...enableTXs.filter((tx): tx is TransactionEnvelope => !!tx)
    );
    const { pending, success } = await handleTXs(
      await wrapTx(bigEnvelope.partition()),
      `Enable ${enableTXs.length} Gauges`
    );
    if (!success) {
      return;
    }
    await Promise.all(pending.map((p) => p.wait({ useWebsocket: true })));
    close();
  };

  return (
    <ModalInner
      title={`Enable ${disabledGauges?.length ?? 0} Gauges`}
      buttonProps={{
        onClick: create,
        variant: "primary",
        children: "Enable All Gauges",
      }}
    >
      <div tw="px-8 flex flex-col items-center">
        <p tw="mb-4 text-sm">Enable all gauges that are currently disabled.</p>
      </div>
    </ModalInner>
  );
};
