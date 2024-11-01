import { GaugeSDK } from "@quarryprotocol/gauge";
import { useTXHandlers } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import invariant from "tiny-invariant";

import { useExecutiveCouncil } from "../../../../../hooks/tribeca/useExecutiveCouncil";
import { useProvider } from "../../../../../hooks/useProvider";
import { useWrapTx } from "../../../../../hooks/useWrapTx";
import { AddressLink } from "../../../../common/AddressLink";
import { AsyncButton } from "../../../../common/AsyncButton";
import { useGMData } from "../../gauges/hooks/useGaugemeister";
import { ChecklistItem } from "./ChecklistItem";

export const GaugeForemanEC: React.FC = () => {
  const { data: gmData } = useGMData();
  const { ownerInvokerKey } = useExecutiveCouncil();
  const { signAndConfirmTX } = useTXHandlers();
  const { providerMut } = useProvider();
  const { wrapTx } = useWrapTx();

  const foreman = mapSome(gmData, (d) => d.account.foreman);
  const foremanIsEC = !!(ownerInvokerKey && foreman?.equals(ownerInvokerKey));

  const isForeman = foreman && !!providerMut?.wallet.publicKey.equals(foreman);

  return (
    <ChecklistItem
      title="Gaugemeister foreman is the Executive Council's Owner Invoker"
      pass={
        gmData === undefined || ownerInvokerKey === undefined
          ? undefined
          : foremanIsEC
      }
    >
      <p>
        The Gaugemeister's foreman is not currently set to the Executive
        Council.
      </p>
      {foreman && (
        <p>
          It is currently set to <AddressLink address={foreman} showCopy />.
          Please connect to this wallet and click the button below.
        </p>
      )}
      <AsyncButton
        disabled={!isForeman}
        variant="primary"
        onClick={async (sdkMut) => {
          invariant(gmData);
          const { gauge } = GaugeSDK.load({ provider: sdkMut.provider });
          const tx = await gauge.setGaugemeisterParams({
            gaugemeister: gmData.publicKey,
            newForeman: ownerInvokerKey,
          });
          await signAndConfirmTX(await wrapTx(tx), "Set foreman to EC");
        }}
      >
        {!isForeman ? "Incorrect wallet" : "Resolve"}
      </AsyncButton>
    </ChecklistItem>
  );
};
