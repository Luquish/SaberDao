import { useSail } from "@rockooor/sail";
import type { TransactionEnvelope } from "@saberhq/solana-contrib";
import { VenkoSDK } from "@venkoapp/venko";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import React from "react";

import { useSDK } from "@/contexts/sdk";
import { useWrapTx } from "@/hooks/tribeca/useWrapTx";
import { useEnvironment } from "@/hooks/tribeca/useEnvironment";
import { useModal } from "@/contexts/tribeca/modal";
import { ModalInner } from "@/components/tribeca/common/Modal/ModalInner";
import { ExternalLink } from "@/components/tribeca/common/typography/ExternalLink";
import type { BulkStreamConfig } from "./BulkCreateStream";

export interface Props {
  config: BulkStreamConfig;
}

const BulkStreamModalInner: React.FC<Props> = ({ config }: Props) => {
  const { sdkMut } = useSDK();
  const { handleTXs } = useSail();
  const { wrapTx } = useWrapTx();
  const { close } = useModal();

  const [txEnvs, setTXEnvs] = useState<TransactionEnvelope[] | null>(null);

  useEffect(() => {
    if (!sdkMut) {
      return;
    }
    void (async () => {
      const { venko } = VenkoSDK.load({ provider: sdkMut.provider });
      const createTXs = await Promise.all(
        config.recipients.map(async (recipient) => {
          const { tx: createTX } = await venko.createStream({
            amount: recipient.amount,
            startTS: Math.floor(config.start.getTime() / 1_000),
            endTS: Math.floor(config.end.getTime() / 1_000),
            revoker: config.revocable
              ? sdkMut.provider.wallet.publicKey
              : undefined,
            recipient: recipient.address,
          });
          return createTX;
        })
      );
      setTXEnvs(createTXs);
    })();
  }, [config, sdkMut]);

  const create = async () => {
    invariant(txEnvs);
    const { pending, success } = await handleTXs(
      await wrapTx(txEnvs),
      "Create Streams"
    );
    if (!success || !pending) {
      return;
    }
    await Promise.all(pending.map((p) => p.wait()));
    close();
  };

  const { network } = useEnvironment();

  return (
    <ModalInner
      title="Bulk Stream Issuance"
      buttonProps={{
        onClick: create,
        variant: "primary",
        children: "Issue Streams",
      }}
    >
      <div>You are about to send the following transactions:</div>
      <div className="flex flex-col text-sm">
        {txEnvs?.map((tx, i) => (
          <div key={i} className="flex justify-between py-4 border-b">
            <div>
              <span>TX #{i + 1}</span>
            </div>
            <div>
              {network !== "localnet" && (
                <ExternalLink href={tx.generateInspectLink(network)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </ModalInner>
  );
};

export default BulkStreamModalInner;
