import type { Message } from "@solana/web3.js";
import copyToClipboard from "copy-to-clipboard";
import { useMemo } from "react";
import tw from "twin.macro";

import { notify } from "../../../../utils/notifications";
import { Button } from "../../../common/Button";
import { TableCardBody } from "../../../common/card/TableCardBody";
import { Card } from "../../../common/governance/Card";
import { AddressWithContext } from "../../../common/program/AddressWithContext";
import { SolAmount } from "../../../common/program/SolAmount";

interface Props {
  message: Message;
}

const DEFAULT_FEES = {
  lamportsPerSignature: 5000,
};

export const TransactionOverview: React.FC<Props> = ({ message }: Props) => {
  const raw = useMemo(() => message.serialize(), [message]);
  const size = useMemo(() => {
    const sigBytes = 1 + 64 * message.header.numRequiredSignatures;
    return sigBytes + raw.length;
  }, [message, raw]);

  const fee =
    message.header.numRequiredSignatures * DEFAULT_FEES.lamportsPerSignature;

  const feePayer = message.accountKeys[0];

  return (
    <Card
      titleStyles={tw`w-full flex items-center justify-between`}
      title={
        <>
          <span>Transaction Overview</span>
          <Button
            variant="outline"
            onClick={() => {
              copyToClipboard(message.serialize().toString("base64"));
              notify({ message: "Copied base64 transaction to clipboard" });
            }}
          >
            Copy as Base64
          </Button>
        </>
      }
      tw="pb-2"
    >
      <div tw="whitespace-nowrap overflow-x-auto">
        <TableCardBody>
          <tr>
            <td>Serialized Size</td>
            <td>
              <div tw="flex flex-col items-end">{size} bytes</div>
            </td>
          </tr>
          <tr>
            <td>Fees</td>
            <td>
              <div tw="flex flex-col items-end">
                <SolAmount lamports={fee} />
              </div>
            </td>
          </tr>
          <tr>
            <td>Fee Payer</td>
            <td>
              {!feePayer ? (
                "No Fee Payer"
              ) : (
                <AddressWithContext pubkey={feePayer} />
              )}
            </td>
          </tr>
        </TableCardBody>
      </div>
    </Card>
  );
};
