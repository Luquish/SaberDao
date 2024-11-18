import { GaugeSDK } from "@quarryprotocol/gauge";
import { useTXHandlers } from "@rockooor/sail";
import { mapSome } from "@saberhq/solana-contrib";
import { FaSign } from "react-icons/fa";
import invariant from "tiny-invariant";

import { useExecutiveCouncil } from "@/hooks/tribeca/useExecutiveCouncil";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { AddressLink } from "@/components/tribeca/common/AddressLink";
import { AsyncButton } from "@/components/tribeca/common/AsyncButton";
import { CardWithImage } from "@/components/tribeca/common/governance/CardWithImage";
import { ProseSmall } from "@/components/tribeca/common/typography/Prose";
import { useGMData } from "@/pages/tribeca/gauges/hooks/useGaugemeister";
import React from "react";

export const GrantToEC: React.FC = () => {
  const { data: gmData } = useGMData();
  const { ownerInvokerKey } = useExecutiveCouncil();
  const { signAndConfirmTX } = useTXHandlers();
  const { wrapTx } = useWrapTx();

  const foreman = mapSome(gmData, (d) => d.account.foreman);
  const foremanIsEC = !!(ownerInvokerKey && foreman?.equals(ownerInvokerKey));

  if (foremanIsEC) {
    return <></>;
  }

  return (
    <CardWithImage
      title="Grant to Executive Council"
      image={
        <div className="flex items-center justify-center h-full">
          <FaSign className="w-20 h-20" />
        </div>
      }
    >
      <ProseSmall>
        <p>
          The Gaugemeister's foreman is not currently set to the Executive
          Council.
        </p>
        {foreman && (
          <p>
            It is currently set to <AddressLink address={foreman} showCopy />.
          </p>
        )}
        <AsyncButton
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
          Set Gaugemeister Foreman to Executive Council
        </AsyncButton>
      </ProseSmall>
    </CardWithImage>
  );
};
