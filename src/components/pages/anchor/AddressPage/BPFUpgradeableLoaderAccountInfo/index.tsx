import type { KeyedAccountInfo } from "@solana/web3.js";
import { capitalize } from "lodash-es";

import { decodeBPFUpgradeableLoaderAccount } from "../../../../../utils/instructions/upgradeable_loader/types";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import { BufferRows } from "./BufferRows";

interface Props {
  data: KeyedAccountInfo;
}

export const BPFUpgradeableLoaderAccountInfo: React.FC<Props> = ({
  data,
}: Props) => {
  const decoded = decodeBPFUpgradeableLoaderAccount(data.accountInfo.data);
  const type = capitalize(decoded.type);
  return (
    <Card title={`BPF Upgradeable Loader: ${type}`}>
      {decoded.type === "buffer" && (
        <TableCardBody rightAlignEnd>
          <BufferRows data={decoded} />
        </TableCardBody>
      )}
    </Card>
  );
};
