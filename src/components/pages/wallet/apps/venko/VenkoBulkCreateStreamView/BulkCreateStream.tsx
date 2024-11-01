import { usePubkey, useToken } from "@rockooor/sail";
import type { Token } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";

import { Textarea } from "../../../../../common/inputs/InputText";
import { LabeledInput } from "../../../../../common/inputs/LabeledInput";
import { ModalButton } from "../../../../../common/Modal/ModalButton";
import { Section } from "../../../../../layout/WalletLayout/Section";
import { BulkStreamConfigRenderer } from "./BulkStreamConfigRenderer";
import { BulkStreamModalInner } from "./BulkStreamModalInner";

interface BulkStreamConfigRaw {
  start: number;
  duration: number;
  recipients: Record<string, { amount: string; address: string }>;
  revocable: boolean;
  token_mint: string;
}

export interface BulkStreamConfig {
  start: Date;
  end: Date;
  recipients: { name: string; amount: TokenAmount; address: PublicKey }[];
  revocable: boolean;
  token: Token;
}

export const BulkCreateStream: React.FC = () => {
  const [configStr, setConfigStr] = useState<string>("");

  const configRaw = useMemo(() => {
    try {
      return JSON.parse(configStr) as BulkStreamConfigRaw;
    } catch (e) {
      return null;
    }
  }, [configStr]);

  const { data: token } = useToken(usePubkey(configRaw?.token_mint));

  const config = useMemo((): BulkStreamConfig | null => {
    if (!token || !configRaw) {
      return null;
    }
    const start = new Date(configRaw.start * 1_000);
    const end = new Date((configRaw.start + configRaw.duration) * 1_000);
    return {
      start,
      end,
      recipients: Object.entries(configRaw.recipients).map(
        ([name, { amount, address }]) => ({
          name,
          amount: TokenAmount.parse(token, amount.replace(/,/g, "")),
          address: new PublicKey(address),
        })
      ),
      revocable: configRaw.revocable,
      token,
    };
  }, [configRaw, token]);

  return (
    <div>
      <Section
        title="Bulk Create Streams"
        description="Create Streams from a JSON spec."
      >
        <div tw="flex flex-col gap-4">
          <LabeledInput
            id="config"
            Component={Textarea}
            label="Configuration JSON"
            value={configStr}
            onChange={(e) => setConfigStr(e.target.value)}
          />
          {config && (
            <>
              <BulkStreamConfigRenderer config={config} />
              <ModalButton
                buttonLabel="Create Streams"
                buttonProps={{ variant: "primary" }}
              >
                {config && <BulkStreamModalInner config={config} />}
              </ModalButton>
            </>
          )}
        </div>
      </Section>
    </div>
  );
};
