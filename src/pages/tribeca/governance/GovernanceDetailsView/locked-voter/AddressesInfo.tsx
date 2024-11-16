import { PublicKey } from "@solana/web3.js";
import type { TrackedAccountInfo } from "@tribecahq/registry";

import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { AddressWithContext } from "../../../../common/program/AddressWithContext";

interface Props {
  addresses: Record<string, TrackedAccountInfo>;
}

export const AddressesInfo: React.FC<Props> = ({ addresses }: Props) => {
  return (
    <Card title="Related Accounts" bodyScrollX tw="col-span-full">
      <TableCardBody>
        {Object.entries(addresses).map(([key, info]) => {
          return (
            <tr key={key}>
              <td>
                <div>
                  <span tw="text-white font-semibold">{info.label}</span>
                  <p tw="text-gray">{info.description}</p>
                </div>
              </td>
              <td>
                <AddressWithContext
                  pubkey={new PublicKey(info.address.toString())}
                  prefixLinkUrlWithAnchor
                />
              </td>
            </tr>
          );
        })}
      </TableCardBody>
    </Card>
  );
};
