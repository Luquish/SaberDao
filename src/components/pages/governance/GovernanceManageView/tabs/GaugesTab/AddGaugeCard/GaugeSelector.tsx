import { useRewarder } from "@rockooor/react-quarry";

import { TableCardBody } from "../../../../../../common/card/TableCardBody";
import { GaugeInfo } from "./GaugeInfo";

export const GaugeSelector: React.FC = () => {
  const { quarries } = useRewarder();
  return (
    <TableCardBody
      head={
        <tr>
          <th>Token</th>
          <th>Mint</th>
          <th>Enabled?</th>
          <th>Actions</th>
        </tr>
      }
    >
      {quarries?.map((quarry) => (
        <GaugeInfo key={quarry.key.toString()} quarry={quarry} />
      ))}
    </TableCardBody>
  );
};
