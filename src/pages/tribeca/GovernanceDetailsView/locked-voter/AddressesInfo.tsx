import { PublicKey } from "@solana/web3.js";
import type { TrackedAccountInfo } from "@tribecahq/registry";

import { TableCardBody } from "@/components/tribeca/common/card/TableCardBody";
import { Card } from "@/components/tribeca/common/governance/Card";
import { AddressWithContext } from "@/components/tribeca/common/program/AddressWithContext";
import React from "react";

interface Props {
  addresses: Record<string, TrackedAccountInfo>;
}

const AddressesInfo: React.FC<Props> = ({ addresses }: Props) => {
  return (
    <Card title="Related Accounts" bodyScrollX className="col-span-full">
      <TableCardBody>
        {Object.entries(addresses).map(([key, info]) => {
          return (
            <tr key={key}>
              <td>
                <div>
                  <span className="text-white font-semibold">{info.label}</span>
                  <p className="text-gray">{info.description}</p>
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

export default AddressesInfo;
